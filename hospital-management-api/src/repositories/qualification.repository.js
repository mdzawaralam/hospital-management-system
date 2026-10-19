
import prisma from "../config/database.js";

export const qualificationRepository = {
    findByName(name) {
        return prisma.qualification.findUnique({
            where: { name },
        });
    },

    create(data) {
        return prisma.qualification.create({
            data,
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                status: true,
            },
        });
    },

    findAll() {
        return prisma.qualification.findMany({
            where: { status: true },
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                status: true,
            },
        });
    },


    findById(id) {
        return prisma.qualification.findUnique({
            where: { id },
        });
    },

    update(id, data) {
        return prisma.qualification.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                status: true,
            },
        });
    },

    delete(id) {
        // Soft delete: preserve the record and doctor references.
        return prisma.qualification.update({
            where: { id },
            data: { status: false },
            select: {
                id: true,
                name: true,
                status: true,
            },
        });
    },





};

