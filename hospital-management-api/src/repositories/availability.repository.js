
import prisma from "../config/database.js";

const availabilitySelect = {
    id: true,
    doctorId: true,
    weekSlotId: true,
    status: true,
    doctor: {
        select: {
            id: true,
            fullName: true,
        },
    },
    weekSlot: {
        select: {
            id: true,
            weekName: true,
            slotId: true,
            slot: {
                select: {
                    id: true,
                    slotTime: true,
                },
            },
        },
    },
};

export const availabilityRepository = {
    findDoctorById(doctorId) {
        return prisma.doctor.findFirst({
            where: {
                id: doctorId,
                status: true,
                user: { status: true },
            },
            select: {
                id: true,
                fullName: true,
            },
        });
    },

    findWeekSlotById(weekSlotId) {
        return prisma.weekSlot.findFirst({
            where: {
                id: weekSlotId,
                status: true,
                weekName: { not: "Sunday" },
                slot: { status: true },
            },
            select: {
                id: true,
                weekName: true,
                slotId: true,
            },
        });
    },

    findByDoctorAndWeekSlot(doctorId, weekSlotId) {
        return prisma.doctorAvailable.findUnique({
            where: {
                doctorId_weekSlotId: {
                    doctorId,
                    weekSlotId,
                },
            },
            select: {
                id: true,
                doctorId: true,
                weekSlotId: true,
                status: true,
            },
        });
    },

    findById(id) {
        return prisma.doctorAvailable.findFirst({
            where: {
                id,
                status: true,
            },
            select: availabilitySelect,
        });
    },

    create(data) {
        return prisma.doctorAvailable.create({
            data,
            select: availabilitySelect,
        });
    },

    update(id, data) {
        return prisma.doctorAvailable.update({
            where: { id },
            data,
            select: availabilitySelect,
        });
    },

    softDelete(id) {
        return prisma.doctorAvailable.update({
            where: { id },
            data: { status: false },
            select: {
                id: true,
                doctorId: true,
                weekSlotId: true,
                status: true,
            },
        });
    },

    findAll() {
        return prisma.doctorAvailable.findMany({
            where: {
                status: true,
            },
            include: {
                doctor: {
                    include: {
                        specialists: {
                            where: {
                                status: true,
                            },
                        },
                    },
                },
                weekSlot: {
                    include: {
                        slot: true,
                    },
                },
            },
        });
    },
};
