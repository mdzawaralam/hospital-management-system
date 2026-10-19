
import { z } from "zod";

export const createQualificationSchema = z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().min(3).max(1000),
}).strict();

export const updateQualificationSchema = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().min(3).max(1000).optional(),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required to update" }
);
