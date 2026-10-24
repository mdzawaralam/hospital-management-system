
import prisma from "../config/database.js";

export const paymentRepository = {
    findPatientByUserId(userId) {
        return prisma.patient.findFirst({
            where: {
                userId,
                status: true,
                user: { status: true },
            },
        });
    },

    findConsultationFee(consultationFeeId, patientId) {
        return prisma.consultationFee.findFirst({
            where: {
                id: consultationFeeId,
                patientId,
                status: true,
                patient: {
                    status: true,
                    user: { status: true },
                },
                doctor: { status: true },
            },
        });
    },

    createPayment(consultationFeeId) {
        return prisma.payment.create({
            data: {
                consultationFeeId,
                paymentMethod: "RAZORPAY",
                paymentStatus: "PENDING",
            },
        });
    },

    updatePayment(paymentId, data) {
        return prisma.payment.update({
            where: { id: paymentId },
            data,
        });
    },

    findPatientPayment(paymentId, patientId) {
        return prisma.payment.findFirst({
            where: {
                id: paymentId,
                consultationFee: { patientId },
            },
            include: {
                consultationFee: true,
            },
        });
    },
};
