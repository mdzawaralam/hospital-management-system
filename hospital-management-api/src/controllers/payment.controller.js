
import { paymentService } from "../services/payment.service.js";

export const paymentController = {
    async createOrder(req, res, next) {
        try {
            const consultationFeeId = Number(req.body.consultationFeeId);

            const result = await paymentService.createOrder(
                req.user.id,
                consultationFeeId
            );

            return res.status(201).json({
                success: true,
                message: "Razorpay order created successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async verifyPayment(req, res, next) {
        try {
            const paymentRecordId = Number(req.body.paymentRecordId);

            const result = await paymentService.verifyPayment(
                req.user.id,
                {
                    ...req.body,
                    paymentRecordId,
                }
            );

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
};
