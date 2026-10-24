import { slotsRepository } from "../repositories/slots.repository.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function parseId(value) {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw createError("Invalid slot ID", 400);
    }

    return id;
}

export const slotsService = {
    async createSlot(input) {
        const slotTime = input.slotTime.trim();

        const existing = await slotsRepository.findBySlotTime(slotTime);

        if (existing) {
            throw createError(
                `Slot "${slotTime}" already exists`,
                409
            );
        }

        try {
            return await slotsRepository.create({
                slotTime,
                status: true,
            });
        } catch (error) {
            // Handles concurrent requests that attempt to create the same slot.
            if (error.code === "P2002") {
                throw createError(
                    `Slot "${slotTime}" already exists`,
                    409
                );
            }

            throw error;
        }
    },

    async getSlots(idValue) {
        if (idValue === undefined) {
            return slotsRepository.findAll();
        }

        const id = parseId(idValue);
        const slot = await slotsRepository.findById(id);

        if (!slot) {
            throw createError("Slot not found", 404);
        }

        return slot;
    },

    async updateSlot(idValue, input) {
        const id = parseId(idValue);
        const existing = await slotsRepository.findById(id);

        if (!existing) {
            throw createError("Slot not found", 404);
        }

        if (input.slotTime !== undefined) {
            const slotTime = input.slotTime.trim();
            const duplicate = await slotsRepository.findBySlotTime(slotTime);

            if (duplicate && duplicate.id !== id) {
                throw createError(
                    `Slot "${slotTime}" already exists`,
                    409
                );
            }

            try {
                return await slotsRepository.update(id, { slotTime });
            } catch (error) {
                if (error.code === "P2002") {
                    throw createError(
                        `Slot "${slotTime}" already exists`,
                        409
                    );
                }

                if (error.code === "P2025") {
                    throw createError("Slot not found", 404);
                }

                throw error;
            }
        }

        return existing;
    },

    async deleteSlot(idValue) {
        const id = parseId(idValue);
        const existing = await slotsRepository.findById(id);

        if (!existing) {
            throw createError("Slot not found", 404);
        }

        try {
            await slotsRepository.softDelete(id);

            return {
                id,
                message: "Slot deactivated successfully",
            };
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Slot not found", 404);
            }

            throw error;
        }
    },
};