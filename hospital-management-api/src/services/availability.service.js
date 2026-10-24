
import { availabilityRepository } from "../repositories/availability.repository.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function parseId(value) {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw createError("Invalid availability ID", 400);
    }

    return id;
}

async function validateReferences(doctorId, weekSlotId) {
    const doctor = await availabilityRepository.findDoctorById(doctorId);

    if (!doctor) {
        throw createError("Active doctor not found", 404);
    }

    const weekSlot =
        await availabilityRepository.findWeekSlotById(weekSlotId);

    if (!weekSlot) {
        throw createError(
            "Active WeekSlot not found, or Sunday is a holiday",
            400
        );
    }
}

async function checkDuplicate(doctorId, weekSlotId, currentId) {
    const existing =
        await availabilityRepository.findByDoctorAndWeekSlot(
            doctorId,
            weekSlotId
        );

    if (existing && existing.id !== currentId) {
        throw createError(
            "This doctor is already assigned to the selected WeekSlot",
            409
        );
    }
}

export const availabilityService = {
    async createAvailability(input) {
        await validateReferences(input.doctorId, input.weekSlotId);

        await checkDuplicate(input.doctorId, input.weekSlotId);

        try {
            return await availabilityRepository.create({
                doctorId: input.doctorId,
                weekSlotId: input.weekSlotId,
                status: true,
            });
        } catch (error) {
            if (error.code === "P2002") {
                throw createError(
                    "This doctor is already assigned to the selected WeekSlot",
                    409
                );
            }

            if (error.code === "P2003") {
                throw createError("Invalid doctor or WeekSlot reference", 400);
            }

            throw error;
        }
    },

    async getAvailability(idValue) {
        if (idValue === undefined) {
            return availabilityRepository.findAll();
        }

        const id = parseId(idValue);
        const availability = await availabilityRepository.findById(id);

        if (!availability) {
            throw createError("Availability record not found", 404);
        }

        return availability;
    },

    async updateAvailability(idValue, input) {
        const id = parseId(idValue);
        const existing = await availabilityRepository.findById(id);

        if (!existing) {
            throw createError("Availability record not found", 404);
        }

        const doctorId = input.doctorId ?? existing.doctorId;
        const weekSlotId = input.weekSlotId ?? existing.weekSlotId;

        await validateReferences(doctorId, weekSlotId);
        await checkDuplicate(doctorId, weekSlotId, id);

        try {
            return await availabilityRepository.update(id, {
                doctorId,
                weekSlotId,
            });
        } catch (error) {
            if (error.code === "P2002") {
                throw createError(
                    "This doctor is already assigned to the selected WeekSlot",
                    409
                );
            }

            if (error.code === "P2003") {
                throw createError("Invalid doctor or WeekSlot reference", 400);
            }

            if (error.code === "P2025") {
                throw createError("Availability record not found", 404);
            }

            throw error;
        }
    },

    async deleteAvailability(idValue) {
        const id = parseId(idValue);
        const existing = await availabilityRepository.findById(id);

        if (!existing) {
            throw createError("Availability record not found", 404);
        }

        try {
            await availabilityRepository.softDelete(id);

            return {
                id,
                message: "Availability deactivated successfully",
            };
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Availability record not found", 404);
            }

            throw error;
        }
    },
};
