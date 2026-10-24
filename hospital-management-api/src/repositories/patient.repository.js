
import prisma from "../config/database.js";

export const patientRepository = {
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

    findDiseaseById(id) {
        return prisma.disease.findUnique({
            where: { id },
        });
    },

    findDoctorById(id) {
        return prisma.doctor.findUnique({
            where: { id },
            include: { user: true },
        });
    },

    findById(id) {
        return prisma.patient.findUnique({
            where: { id },
            include: { user: true },
        });
    },

    async createWithUser(userData, patientData) {
        return prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: userData,
            });

            return tx.patient.create({
                data: {
                    ...patientData,
                    userId: user.id,
                },
                select: {
                    id: true,
                    userId: true,
                    fullName: true,
                    mobileNumber: true,
                    diseaseId: true,
                    doctorId: true,
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
        return prisma.patient.update({
            where: { id },
            data,
            select: {
                id: true,
                userId: true,
                fullName: true,
                mobileNumber: true,
                diseaseId: true,
                doctorId: true,
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
            await tx.patient.update({
                where: { id },
                data: { status: false },
            });

            await tx.user.update({
                where: { id: userId },
                data: { status: false },
            });
        });
    },

    findAllPatients() {
        return prisma.patient.findMany({
            where: {
                status: true,
                user: { status: true },
            },
            select: {
                id: true,
                userId: true,
                fullName: true,
                mobileNumber: true,
                diseaseId: true,
                doctorId: true,
                address: true,
                city: true,
                country: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: { emailAddress: true },
                },
                disease: {
                    select: {
                        id: true,
                        diseaseName: true,
                    },
                },
                doctor: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
            orderBy: { id: "asc" },
        });
    },

    findPatientById(id) {
        return prisma.patient.findFirst({
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
                diseaseId: true,
                doctorId: true,
                address: true,
                city: true,
                country: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: { emailAddress: true },
                },
                disease: {
                    select: {
                        id: true,
                        diseaseName: true,
                    },
                },
                doctor: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });
    },
};
