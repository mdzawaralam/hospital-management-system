import prisma from "../config/database.js";

const messageSelect = {
    id: true,
    fromUserId: true,
    toUserId: true,
    message: true,
    createdAt: true,
    updatedAt: true,
    status: true,
    fromUser: {
        select: {
            id: true,
            emailAddress: true,
            role: {
                select: {
                    roleName: true,
                },
            },
        },
    },
    toUser: {
        select: {
            id: true,
            emailAddress: true,
            role: {
                select: {
                    roleName: true,
                },
            },
        },
    },
};

export const messageRepository = {
    findActiveUserById(userId) {
        return prisma.user.findFirst({
            where: {
                id: userId,
                status: true,
            },
            select: {
                id: true,
                emailAddress: true,
            },
        });
    },

    findById(id) {
        return prisma.message.findFirst({
            where: {
                id,
                status: true,
            },
            select: messageSelect,
        });
    },

    findAll() {
        return prisma.message.findMany({
            where: {
                status: true,
            },
            select: messageSelect,
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    create(data) {
        return prisma.message.create({
            data,
            select: messageSelect,
        });
    },

    update(id, data) {
        return prisma.message.update({
            where: { id },
            data,
            select: messageSelect,
        });
    },

    softDelete(id) {
        return prisma.message.update({
            where: { id },
            data: {
                status: false,
            },
            select: {
                id: true,
                status: true,
            },
        });
    },
};