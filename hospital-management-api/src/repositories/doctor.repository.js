
import prisma from "../config/database.js";

export const doctorRepository = {
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
        return prisma.doctor.findUnique({
            where: { id },
            include: { user: true },
        });
    },

    async createWithUser(userData, doctorData) {
        return prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: userData,
            });

            return tx.doctor.create({
                data: {
                    ...doctorData,
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
                        select: { emailAddress: true },
                    },
                },
            });
        });
    },

    update(id, data) {
        return prisma.doctor.update({
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
            await tx.doctor.update({
                where: { id },
                data: { status: false },
            });

            await tx.user.update({
                where: { id: userId },
                data: { status: false },
            });
        });
    },

    async findAllDoctors() {
        return prisma.doctor.findMany({
            where: { status: true },
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
            orderBy: {
                id: "asc",
            },
        });
    },

    async findDoctorById(id) {
        return prisma.doctor.findUnique({
            where: { id, status: true },
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
