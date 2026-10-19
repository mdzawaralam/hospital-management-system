
import { z } from "zod";

export const createDoctorSchema = z.object({
    fullName: z.string().trim().min(2).max(150),
    mobileNumber: z.string().trim().min(7).max(20),
    emailAddress: z.string().trim().email().max(254)
        .transform((value) => value.toLowerCase()),
    qualificationId: z.coerce.number().int().positive(),
    address: z.string().trim().min(3).max(500),
    city: z.string().trim().min(2).max(100),
    country: z.string().trim().min(2).max(100),
}).strict();

export const updateDoctorSchema = z.object({
    fullName: z.string().trim().min(2).max(150).optional(),
    mobileNumber: z.string().trim().min(7).max(20).optional(),
    qualificationId: z.coerce.number().int().positive().optional(),
    address: z.string().trim().min(3).max(500).optional(),
    city: z.string().trim().min(2).max(100).optional(),
    country: z.string().trim().min(2).max(100).optional(),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required to update" }
);
