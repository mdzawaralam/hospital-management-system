
import prisma from "../config/database.js";

const specialistSelect = {
    id: true,
    doctorId: true,
    specialistName: true,
    description: true,
    status: true,
    doctor: {
        select: {
            id: true,
            fullName: true,
        },
    },
};

export const specialistRepository = {
    findDoctorById(doctorId) {
        return prisma.doctor.findFirst({
            where: {
                id: doctorId,
                status: true,
                user: { status: true },
            },
            select: { id: true, fullName: true },
        });
    },

    findById(id) {
        return prisma.specialist.findFirst({
            where: { id, status: true },
            select: specialistSelect,
        });
    },

    create(data) {
        return prisma.specialist.create({
            data,
            select: specialistSelect,
        });
    },

    update(id, data) {
        return prisma.specialist.update({
            where: { id },
            data,
            select: specialistSelect,
        });
    },

    softDelete(id) {
        return prisma.specialist.update({
            where: { id },
            data: { status: false },
            select: {
                id: true,
                specialistName: true,
                status: true,
            },
        });
    },

    findAll() {
        return prisma.specialist.findMany({
            where: {
                status: true,
                doctor: {
                    status: true,
                    user: { status: true },
                },
            },
            select: specialistSelect,
            orderBy: { id: "asc" },
        });
    },
};
