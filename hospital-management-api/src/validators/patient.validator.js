
import { z } from "zod";

const patientFields = {
    fullName: z.string().trim().min(2).max(100),
    mobileNumber: z.string().trim().min(10).max(20),
    diseaseId: z.number().int().positive(),
    doctorId: z.number().int().positive().nullable().optional(),
    address: z.string().trim().min(3).max(255),
    city: z.string().trim().min(2).max(100),
    country: z.string().trim().min(2).max(100),
};

export const createPatientSchema = z.object({
    emailAddress: z.string().trim().email().max(254),
    ...patientFields,
}).strict();

export const updatePatientSchema = z.object({
    ...Object.fromEntries(
        Object.entries(patientFields).map(([key, schema]) => [
            key,
            schema.optional(),
        ])
    ),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required for update" }
);
