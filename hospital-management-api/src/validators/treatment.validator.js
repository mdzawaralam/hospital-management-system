
import { z } from "zod";

export const createTreatmentSchema = z
    .object({
        patientId: z.number().int().positive(),
        doctorId: z.number().int().positive(),
        treatmentDetails: z.string().trim().min(1).max(20000),
        medicineName: z.string().trim().min(1).max(10000),
        testDetails: z.string().trim().min(1).max(10000),
    })
    .strict();

export const updateTreatmentSchema = z
    .object({
        patientId: z.number().int().positive().optional(),
        doctorId: z.number().int().positive(),
        treatmentDetails: z.string().trim().min(1).max(20000).optional(),
        medicineName: z.string().trim().min(1).max(10000).optional(),
        testDetails: z.string().trim().min(1).max(10000).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required for update",
    });
