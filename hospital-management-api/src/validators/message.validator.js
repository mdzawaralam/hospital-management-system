import { z } from "zod";

export const createMessageSchema = z
    .object({
        fromUserId: z.number().int().positive(),
        toUserId: z.number().int().positive(),
        message: z.string().trim().min(1).max(50000),
    })
    .strict()
    .refine((data) => data.fromUserId !== data.toUserId, {
        message: "Sender and receiver must be different users.",
        path: ["toUserId"],
    });

export const updateMessageSchema = z
    .object({
        fromUserId: z.number().int().positive().optional(),
        toUserId: z.number().int().positive().optional(),
        message: z.string().trim().min(1).max(50000).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required for update.",
    })
    .refine(
        (data) =>
            data.fromUserId === undefined ||
            data.toUserId === undefined ||
            data.fromUserId !== data.toUserId,
        {
            message: "Sender and receiver must be different users.",
            path: ["toUserId"],
        }
    );