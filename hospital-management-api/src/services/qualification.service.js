
import { qualificationRepository } from "../repositories/qualification.repository.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

export const qualificationService = {
    async createQualification(input) {
        const name = input.name.trim();
        const description = input.description.trim();

        const existing = await qualificationRepository.findByName(name);

        if (existing) {
            throw createError("Qualification already exists", 409);
        }

        try {
            return await qualificationRepository.create({
                name,
                description,
            });
        } catch (error) {
            if (error.code === "P2002") {
                throw createError("Qualification already exists", 409);
            }

            throw error;
        }
    },

    async getQualifications() {
        return qualificationRepository.findAll();
    },



    async updateQualification(id, input) {
        const qualificationId = Number(id);

        if (!Number.isSafeInteger(qualificationId) || qualificationId <= 0) {
            throw createError("Invalid qualification ID", 400);
        }

        const existing = await qualificationRepository.findById(qualificationId);

        if (!existing || !existing.status) {
            throw createError("Qualification not found", 404);
        }

        if (input.name !== undefined) {
            const duplicate = await qualificationRepository.findByName(input.name);

            if (duplicate && duplicate.id !== qualificationId) {
                throw createError("Qualification name already exists", 409);
            }
        }

        try {
            return await qualificationRepository.update(qualificationId, input);
        } catch (error) {
            if (error.code === "P2002") {
                throw createError("Qualification name already exists", 409);
            }
            if (error.code === "P2025") {
                throw createError("Qualification not found", 404);
            }
            throw error;
        }
    },

    async deleteQualification(id) {
        const qualificationId = Number(id);

        if (!Number.isSafeInteger(qualificationId) || qualificationId <= 0) {
            throw createError("Invalid qualification ID", 400);
        }

        const existing = await qualificationRepository.findById(qualificationId);

        if (!existing || !existing.status) {
            throw createError("Qualification not found", 404);
        }

        try {
            return await qualificationRepository.delete(qualificationId);
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Qualification not found", 404);
            }
            throw error;
        }
    },

};


