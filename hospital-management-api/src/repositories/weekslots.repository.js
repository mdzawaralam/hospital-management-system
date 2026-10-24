
import prisma from "../config/database.js";

const weekSlotSelect = {
    id: true,
    weekName: true,
    slotId: true,
    status: true,
    slot: {
        select: {
            id: true,
            slotTime: true,
            status: true,
        },
    },
};

export const weekSlotsRepository = {
    findSlotById(slotId) {
        return prisma.slots.findFirst({
            where: {
                id: slotId,
                status: true,
            },
            select: {
                id: true,
                slotTime: true,
                status: true,
            },
        });
    },

    findById(id) {
        return prisma.weekSlot.findFirst({
            where: { id, status: true },
            select: weekSlotSelect,
        });
    },

    findByWeekNameAndSlotId(weekName, slotId) {
        return prisma.weekSlot.findUnique({
            where: {
                weekName_slotId: {
                    weekName,
                    slotId,
                },
            },
            select: {
                id: true,
                weekName: true,
                slotId: true,
                status: true,
            },
        });
    },

    create(data) {
        return prisma.weekSlot.create({
            data,
            select: weekSlotSelect,
        });
    },

    update(id, data) {
        return prisma.weekSlot.update({
            where: { id },
            data,
            select: weekSlotSelect,
        });
    },

    softDelete(id) {
        return prisma.weekSlot.update({
            where: { id },
            data: { status: false },
            select: {
                id: true,
                weekName: true,
                slotId: true,
                status: true,
            },
        });
    },

    findAll() {
        return prisma.weekSlot.findMany({
            where: { status: true },
            select: weekSlotSelect,
            orderBy: [
                { weekName: "asc" },
                { slotId: "asc" },
            ],
        });
    },
};
