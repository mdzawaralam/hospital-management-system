
import { weekSlotsRepository } from "../repositories/weekslots.repository.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function parseId(value) {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw createError("Invalid WeekSlot ID", 400);
    }

    return id;
}

function validateWeekday(weekName) {
    if (weekName === "Sunday") {
        throw createError(
            "Sunday is a holiday. WeekSlot cannot be created or updated for Sunday.",
            400
        );
    }
}

async function validateSlot(slotId) {
    const slot = await weekSlotsRepository.findSlotById(slotId);

    if (!slot) {
        throw createError("Active slot not found", 404);
    }
}

async function checkDuplicate(weekName, slotId, currentId) {
    const existing =
        await weekSlotsRepository.findByWeekNameAndSlotId(
            weekName,
            slotId
        );

    if (existing && existing.id !== currentId) {
        throw createError(
            `A record already exists for ${weekName} with slotId ${slotId}`,
            409
        );
    }
}

export const weekSlotsService = {
    async createWeekSlot(input) {
        validateWeekday(input.weekName);

        await validateSlot(input.slotId);

        await checkDuplicate(input.weekName, input.slotId);

        try {
            return await weekSlotsRepository.create({
                weekName: input.weekName,
                slotId: input.slotId,
                status: true,
            });
        } catch (error) {
            if (error.code === "P2002") {
                throw createError(
                    "This weekday and slot combination already exists",
                    409
                );
            }

            if (error.code === "P2003") {
                throw createError("Invalid slot reference", 400);
            }

            throw error;
        }
    },

    async getWeekSlots(idValue) {
        if (idValue === undefined) {
            return weekSlotsRepository.findAll();
        }

        const id = parseId(idValue);
        const weekSlot = await weekSlotsRepository.findById(id);

        if (!weekSlot) {
            throw createError("WeekSlot not found", 404);
        }

        return weekSlot;
    },

    async updateWeekSlot(idValue, input) {
        const id = parseId(idValue);
        const existing = await weekSlotsRepository.findById(id);

        if (!existing) {
            throw createError("WeekSlot not found", 404);
        }

        const weekName = input.weekName ?? existing.weekName;
        const slotId = input.slotId ?? existing.slotId;

        // Prevent changing any WeekSlot to Sunday.
        validateWeekday(weekName);

        if (input.slotId !== undefined) {
            await validateSlot(slotId);
        }

        await checkDuplicate(weekName, slotId, id);

        try {
            return await weekSlotsRepository.update(id, {
                weekName,
                slotId,
            });
        } catch (error) {
            if (error.code === "P2002") {
                throw createError(
                    "This weekday and slot combination already exists",
                    409
                );
            }

            if (error.code === "P2003") {
                throw createError("Invalid slot reference", 400);
            }

            if (error.code === "P2025") {
                throw createError("WeekSlot not found", 404);
            }

            throw error;
        }
    },

    async deleteWeekSlot(idValue) {
        const id = parseId(idValue);
        const existing = await weekSlotsRepository.findById(id);

        if (!existing) {
            throw createError("WeekSlot not found", 404);
        }

        try {
            await weekSlotsRepository.softDelete(id);

            return {
                id,
                message: "WeekSlot deactivated successfully",
            };
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("WeekSlot not found", 404);
            }

            throw error;
        }
    },
};
