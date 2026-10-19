
import prisma from "../config/database.js";

export const receptionistRepository = {
    findUserByEmail(emailAddress) {
        return prisma.user.findUnique({
            where: { emailAddress },
        });
    },

    findRoleByName(roleName) {
        return prisma.role.findUnique({
            where: { roleName },
        });
    },

    findQualificationById(id) {
        return prisma.qualification.findUnique({
            where: { id },
        });
    },

    findById(id) {
        return prisma.receptionist.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
    },

    async createWithUser(userData, receptionistData) {
        return prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: userData,
            });

            return tx.receptionist.create({
                data: {
                    ...receptionistData,
                    userId: user.id,
                },
                select: {
                    id: true,
                    userId: true,
                    fullName: true,
                    mobileNumber: true,
                    qualificationId: true,
                    address: true,
                    city: true,
                    country: true,
                    status: true,
                    createdAt: true,
                    user: {
                        select: {
                            emailAddress: true,
                        },
                    },
                },
            });
        });
    },

    update(id, data) {
        return prisma.receptionist.update({
            where: { id },
            data,
            select: {
                id: true,
                userId: true,
                fullName: true,
                mobileNumber: true,
                qualificationId: true,
                address: true,
                city: true,
                country: true,
                status: true,
                updatedAt: true,
            },
        });
    },

    async softDelete(id, userId) {
        return prisma.$transaction(async (tx) => {
            await tx.receptionist.update({
                where: { id },
                data: { status: false },
            });

            await tx.user.update({
                where: { id: userId },
                data: { status: false },
            });
        });
    },

    findAllReceptionists() {
        return prisma.receptionist.findMany({
            where: {
                status: true,
                user: { status: true },
            },
            select: {
                id: true,
                userId: true,
                fullName: true,
                mobileNumber: true,
                qualificationId: true,
                address: true,
                city: true,
                country: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        emailAddress: true,
                    },
                },
            },
            orderBy: { id: "asc" },
        });
    },

    findReceptionistById(id) {
        return prisma.receptionist.findFirst({
            where: {
                id,
                status: true,
                user: { status: true },
            },
            select: {
                id: true,
                userId: true,
                fullName: true,
                mobileNumber: true,
                qualificationId: true,
                address: true,
                city: true,
                country: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        emailAddress: true,
                    },
                },
            },
        });
    },
};
