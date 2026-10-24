
import { specialistRepository } from "../repositories/specialist.repository.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function parseId(value) {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw createError("Invalid specialist ID", 400);
    }

    return id;
}

async function validateDoctor(doctorId) {
    const doctor = await specialistRepository.findDoctorById(doctorId);

    if (!doctor) {
        throw createError("Active doctor not found", 404);
    }
}

export const specialistService = {
    async createSpecialist(input) {
        await validateDoctor(input.doctorId);

        return specialistRepository.create({
            doctorId: input.doctorId,
            specialistName: input.specialistName,
            description: input.description,
            status: true,
        });
    },

    async getSpecialists(idValue) {
        if (idValue === undefined) {
            return specialistRepository.findAll();
        }

        const id = parseId(idValue);
        const specialist = await specialistRepository.findById(id);

        if (!specialist) {
            throw createError("Specialist not found", 404);
        }

        return specialist;
    },

    async updateSpecialist(idValue, input) {
        const id = parseId(idValue);
        const existing = await specialistRepository.findById(id);

        if (!existing) {
            throw createError("Specialist not found", 404);
        }

        if (input.doctorId !== undefined) {
            await validateDoctor(input.doctorId);
        }

        try {
            return await specialistRepository.update(id, input);
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Specialist not found", 404);
            }

            throw error;
        }
    },

    async deleteSpecialist(idValue) {
        const id = parseId(idValue);
        const existing = await specialistRepository.findById(id);

        if (!existing) {
            throw createError("Specialist not found", 404);
        }

        try {
            await specialistRepository.softDelete(id);

            return {
                id,
                message: "Specialist deactivated successfully",
            };
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Specialist not found", 404);
            }

            throw error;
        }
    },
};
