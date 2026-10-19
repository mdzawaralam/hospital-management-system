
import { z } from "zod";

export const loginSchema = z.object({
    emailAddress: z.string().trim().email().max(254)
        .transform((value) => value.toLowerCase()),
    password: z.string().min(1).max(128),
}).strict();

export const refreshSchema = z.object({
    refreshToken: z.string().min(1),
}).strict();

export const logoutSchema = z.object({
    refreshToken: z.string().min(1),
}).strict();
