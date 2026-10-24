import { z } from "zod";

// Use a consistent 24-hour format, for example "10:00-11:00".
const slotTimeSchema = z
    .string()
    .trim()
    .regex(
        /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/,
        "slotTime must use HH:mm-HH:mm format, e.g. 10:00-11:00"
    )
    .refine((value) => {
        const [start, end] = value.split("-");
        return start < end;
    }, "End time must be later than start time");

export const createSlotSchema = z
    .object({
        slotTime: slotTimeSchema,
    })
    .strict();

export const updateSlotSchema = z
    .object({
        slotTime: slotTimeSchema.optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required for update",
    });