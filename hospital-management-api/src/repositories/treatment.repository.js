
import prisma from "../config/database.js";

const treatmentSelect = {
    id: true,
    patientId: true,
    doctorId: true,
    treatmentDetails: true,
    medicineName: true,
    testDetails: true,
    createdAt: true,
    updatedAt: true,
    status: true,
    patient: {
        select: {
            id: true,
            fullName: true,
        },
    },
    doctor: {
        select: {
            id: true,
            fullName: true,
        },
    },
};

export const treatmentRepository = {
    findDoctorByUserId(userId) {
        return prisma.doctor.findFirst({
            where: {
                userId,
                status: true,
                user: { status: true },
            },
            select: {
                id: true,
                userId: true,
                fullName: true,
            },
        });
    },

    findPatientById(patientId) {
        return prisma.patient.findFirst({
            where: {
                id: patientId,
                status: true,
                user: { status: true },
            },
            select: {
                id: true,
                fullName: true,
            },
        });
    },

    findById(id) {
        return prisma.patientTreatment.findFirst({
            where: {
                id,
                status: true,
            },
            select: treatmentSelect,
        });
    },

    create(data) {
        return prisma.patientTreatment.create({
            data,
            select: treatmentSelect,
        });
    },

    update(id, data) {
        return prisma.patientTreatment.update({
            where: { id },
            data,
            select: treatmentSelect,
        });
    },

    softDelete(id) {
        return prisma.patientTreatment.update({
            where: { id },
            data: { status: false },
            select: {
                id: true,
                patientId: true,
                doctorId: true,
                status: true,
            },
        });
    },

    findAll() {
        return prisma.patientTreatment.findMany({
            where: {
                status: true,
                patient: {
                    status: true,
                    user: { status: true },
                },
                doctor: {
                    status: true,
                    user: { status: true },
                },
            },
            select: treatmentSelect,
            orderBy: { createdAt: "desc" },
        });
    },
};
