
import { z } from "zod";

const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export const createWeekSlotSchema = z
    .object({
        weekName: z.enum(weekDays),
        slotId: z.number().int().positive(),
    })
    .strict();

export const updateWeekSlotSchema = z
    .object({
        weekName: z.enum(weekDays).optional(),
        slotId: z.number().int().positive().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field is required for update",
    });
