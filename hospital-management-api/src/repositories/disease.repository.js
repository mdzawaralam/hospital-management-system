
import prisma from "../config/database.js";

export const diseaseRepository = {
    findByName(diseaseName) {
        return prisma.disease.findUnique({
            where: { diseaseName },
        });
    },

    findById(id) {
        return prisma.disease.findUnique({
            where: { id },
        });
    },

    create(data) {
        return prisma.disease.create({
            data,
            select: {
                id: true,
                diseaseName: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },

    update(id, data) {
        return prisma.disease.update({
            where: { id },
            data,
            select: {
                id: true,
                diseaseName: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },

    softDelete(id) {
        return prisma.disease.update({
            where: { id },
            data: { status: false },
            select: {
                id: true,
                diseaseName: true,
                status: true,
            },
        });
    },

    findAll() {
        return prisma.disease.findMany({
            where: { status: true },
            select: {
                id: true,
                diseaseName: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { id: "asc" },
        });
    },

    findActiveById(id) {
        return prisma.disease.findFirst({
            where: {
                id,
                status: true,
            },
            select: {
                id: true,
                diseaseName: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },
};
