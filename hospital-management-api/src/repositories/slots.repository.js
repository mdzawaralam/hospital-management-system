import prisma from "../config/database.js";

const slotSelect = {
    id: true,
    slotTime: true,
    status: true,
};

export const slotsRepository = {
    findBySlotTime(slotTime) {
        return prisma.slots.findUnique({
            where: { slotTime },
            select: slotSelect,
        });
    },

    findById(id) {
        return prisma.slots.findFirst({
            where: {
                id,
                status: true,
            },
            select: slotSelect,
        });
    },

    create(data) {
        return prisma.slots.create({
            data,
            select: slotSelect,
        });
    },

    update(id, data) {
        return prisma.slots.update({
            where: { id },
            data,
            select: slotSelect,
        });
    },

    softDelete(id) {
        return prisma.slots.update({
            where: { id },
            data: { status: false },
            select: slotSelect,
        });
    },

    findAll() {
        return prisma.slots.findMany({
            where: { status: true },
            select: slotSelect,
            orderBy: { id: "asc" },
        });
    },
};