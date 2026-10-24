
import { diseaseRepository } from "../repositories/disease.repository.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function parseId(value) {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw createError("Invalid disease ID", 400);
    }

    return id;
}

export const diseaseService = {
    async createDisease(input) {
        const existing = await diseaseRepository.findByName(
            input.diseaseName
        );

        if (existing) {
            throw createError("Disease name already exists", 409);
        }

        try {
            return await diseaseRepository.create({
                diseaseName: input.diseaseName,
                description: input.description,
                status: true,
            });
        } catch (error) {
            if (error.code === "P2002") {
                throw createError("Disease name already exists", 409);
            }

            throw error;
        }
    },

    async updateDisease(idValue, input) {
        const id = parseId(idValue);

        const existing = await diseaseRepository.findActiveById(id);

        if (!existing) {
            throw createError("Active disease not found", 404);
        }

        if (input.diseaseName !== undefined) {
            const duplicate = await diseaseRepository.findByName(
                input.diseaseName
            );

            if (duplicate && duplicate.id !== id) {
                throw createError("Disease name already exists", 409);
            }
        }

        try {
            return await diseaseRepository.update(id, input);
        } catch (error) {
            if (error.code === "P2002") {
                throw createError("Disease name already exists", 409);
            }

            if (error.code === "P2025") {
                throw createError("Disease not found", 404);
            }

            throw error;
        }
    },

    async deleteDisease(idValue) {
        const id = parseId(idValue);

        const existing = await diseaseRepository.findActiveById(id);

        if (!existing) {
            throw createError("Active disease not found", 404);
        }

        try {
            const disease = await diseaseRepository.softDelete(id);

            return {
                id: disease.id,
                message: "Disease deactivated successfully",
            };
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Disease not found", 404);
            }

            throw error;
        }
    },

    async getDiseases(idValue) {
        if (idValue !== undefined) {
            const id = parseId(idValue);
            return diseaseRepository.findActiveById(id);
        }

        return diseaseRepository.findAll();
    },
};
