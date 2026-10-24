
import { z } from "zod";

const receptionistFields = {
    fullName: z.string().trim().min(2).max(100),
    mobileNumber: z.string().trim().min(10).max(20),
    qualificationId: z.number().int().positive(),
    address: z.string().trim().min(3).max(255),
    city: z.string().trim().min(2).max(100),
    country: z.string().trim().min(2).max(100),
};

export const createReceptionistSchema = z.object({
    emailAddress: z.string().trim().email().max(254),
    ...receptionistFields,
}).strict();

export const updateReceptionistSchema = z.object({
    ...Object.fromEntries(
        Object.entries(receptionistFields).map(([key, schema]) => [
            key,
            schema.optional(),
        ])
    ),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required for update" }
);
