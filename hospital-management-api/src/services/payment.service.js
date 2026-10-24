
import crypto from "node:crypto";
import { razorpay, keyId } from "../config/razorpay.js";
import { paymentRepository } from "../repositories/payment.repository.js";

function toPaise(decimalAmount) {
    // Prisma Decimal returns a decimal-safe string such as "1250.50".
    const amount = decimalAmount.toString();

    if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
        throw new Error("Invalid consultation fee amount");
    }

    const [rupees, fraction = ""] = amount.split(".");
    const paise = Number(rupees) * 100 + Number(fraction.padEnd(2, "0"));

    if (!Number.isSafeInteger(paise) || paise <= 0) {
        throw new Error("Consultation fee must be greater than zero");
    }

    return paise;
}

function signaturesMatch(expectedHex, receivedHex) {
    if (
        typeof receivedHex !== "string" ||
        !/^[a-f0-9]{64}$/i.test(receivedHex)
    ) {
        return false;
    }

    const expected = Buffer.from(expectedHex, "hex");
    const received = Buffer.from(receivedHex, "hex");

    return expected.length === received.length &&
        crypto.timingSafeEqual(expected, received);
}

export const paymentService = {
    async createOrder(userId, consultationFeeId) {
        if (
            !Number.isSafeInteger(consultationFeeId) ||
            consultationFeeId <= 0
        ) {
            const error = new Error("Valid consultationFeeId is required");
            error.statusCode = 400;
            throw error;
        }

        const patient =
            await paymentRepository.findPatientByUserId(userId);

        if (!patient) {
            const error = new Error("Active patient profile not found");
            error.statusCode = 404;
            throw error;
        }

        const fee = await paymentRepository.findConsultationFee(
            consultationFeeId,
            patient.id
        );

        if (!fee) {
            const error = new Error(
                "Active consultation fee not found for this patient"
            );
            error.statusCode = 404;
            throw error;
        }

        const amount = toPaise(fee.consultFee);

        // Create a pending database record before calling Razorpay.
        const payment = await paymentRepository.createPayment(fee.id);

        try {
            const order = await razorpay.orders.create({
                amount,
                currency: "INR",
                receipt: `cf${fee.id}p${payment.id}`,
                notes: {
                    paymentRecordId: String(payment.id),
                    consultationFeeId: String(fee.id),
                    patientId: String(patient.id),
                },
            });

            await paymentRepository.updatePayment(payment.id, {
                gatewayOrderId: order.id,
            });

            return {
                keyId,
                paymentRecordId: payment.id,
                consultationFeeId: fee.id,
                amount: order.amount,
                currency: order.currency,
                orderId: order.id,
            };
        } catch (error) {
            await paymentRepository.updatePayment(payment.id, {
                paymentStatus: "FAILED",
                notes: "Order creation failed; check gateway status before retrying.",
            });

            throw error;
        }
    },

    async verifyPayment(userId, input) {
        const { paymentRecordId, razorpay_order_id, razorpay_payment_id,
            razorpay_signature } = input;

        if (
            !Number.isSafeInteger(paymentRecordId) ||
            paymentRecordId <= 0 ||
            typeof razorpay_order_id !== "string" ||
            typeof razorpay_payment_id !== "string" ||
            typeof razorpay_signature !== "string"
        ) {
            const error = new Error("Invalid payment verification details");
            error.statusCode = 400;
            throw error;
        }

        const patient =
            await paymentRepository.findPatientByUserId(userId);

        if (!patient) {
            const error = new Error("Active patient profile not found");
            error.statusCode = 404;
            throw error;
        }

        const payment = await paymentRepository.findPatientPayment(
            paymentRecordId,
            patient.id
        );

        if (!payment || payment.paymentMethod !== "RAZORPAY") {
            const error = new Error("Payment record not found");
            error.statusCode = 404;
            throw error;
        }

        if (payment.gatewayOrderId !== razorpay_order_id) {
            const error = new Error("Razorpay order does not match");
            error.statusCode = 400;
            throw error;
        }

        // Idempotent response for a previously verified payment.
        if (payment.paymentStatus === "SUCCESS") {
            if (payment.transactionId === razorpay_payment_id) {
                return {
                    paymentRecordId: payment.id,
                    paymentStatus: "SUCCESS",
                    message: "Payment was already verified",
                };
            }

            const error = new Error("Payment record is already completed");
            error.statusCode = 409;
            throw error;
        }

        if (payment.paymentStatus !== "PENDING") {
            const error = new Error("Payment is not pending");
            error.statusCode = 409;
            throw error;
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (!signaturesMatch(expectedSignature, razorpay_signature)) {
            const error = new Error("Invalid Razorpay payment signature");
            error.statusCode = 400;
            throw error;
        }

        // Verify the payment with Razorpay as well, rather than trusting
        // only the values posted by the browser.
        const gatewayPayment =
            await razorpay.payments.fetch(razorpay_payment_id);

        if (
            gatewayPayment.order_id !== razorpay_order_id ||
            gatewayPayment.status !== "captured" ||
            gatewayPayment.amount !== toPaise(payment.consultationFee.consultFee) ||
            gatewayPayment.currency !== "INR"
        ) {
            const error = new Error(
                "Payment is not captured or its details do not match"
            );
            error.statusCode = 400;
            throw error;
        }

        // Update only after the signature and gateway details are verified.
        const updated = await paymentRepository.updatePayment(payment.id, {
            paymentStatus: "SUCCESS",
            transactionId: razorpay_payment_id,
        });

        return {
            paymentRecordId: updated.id,
            paymentStatus: updated.paymentStatus,
            transactionId: updated.transactionId,
            message: "Payment verified successfully",
        };
    },
};
