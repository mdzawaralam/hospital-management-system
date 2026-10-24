
import { weekSlotsService } from "../services/weekslots.service.js";

export const weekSlotsController = {
    async create(req, res, next) {
        try {
            const data = await weekSlotsService.createWeekSlot(
                req.validatedBody
            );

            return res.status(201).json({
                success: true,
                message: "WeekSlot created successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async getWeekSlots(req, res, next) {
        try {
            const data = await weekSlotsService.getWeekSlots(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                message: req.params.id
                    ? "WeekSlot fetched successfully"
                    : "WeekSlots fetched successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const data = await weekSlotsService.updateWeekSlot(
                req.params.id,
                req.validatedBody
            );

            return res.status(200).json({
                success: true,
                message: "WeekSlot updated successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const data = await weekSlotsService.deleteWeekSlot(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                message: data.message,
                data: { id: data.id },
            });
        } catch (error) {
            next(error);
        }
    },
};
