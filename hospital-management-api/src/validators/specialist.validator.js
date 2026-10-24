
import { z } from "zod";

export const createSpecialistSchema = z
    .object({
        doctorId: z.number().int().positive(),
        specialistName: z.string().trim().min(2).max(150),
        description: z.string().trim().min(3).max(5000),
    })
    .strict();

export const updateSpecialistSchema = z
    .object({
        doctorId: z.number().int().positive().optional(),
        specialistName: z.string().trim().min(2).max(150).optional(),
        description: z.string().trim().min(3).max(5000).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required for update",
    });
