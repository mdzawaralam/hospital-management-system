
import { z } from "zod";

export const createAvailabilitySchema = z
    .object({
        doctorId: z.number().int().positive(),
        weekSlotId: z.number().int().positive(),
    })
    .strict();

export const updateAvailabilitySchema = z
    .object({
        doctorId: z.number().int().positive().optional(),
        weekSlotId: z.number().int().positive().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required for update",
    });
