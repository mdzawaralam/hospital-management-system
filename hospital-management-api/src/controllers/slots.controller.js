import { slotsService } from "../services/slots.service.js";

export const slotsController = {
    async create(req, res, next) {
        try {
            const data = await slotsService.createSlot(req.validatedBody);

            return res.status(201).json({
                success: true,
                message: "Slot created successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async getSlots(req, res, next) {
        try {
            const data = await slotsService.getSlots(req.params.id);

            return res.status(200).json({
                success: true,
                message: req.params.id
                    ? "Slot fetched successfully"
                    : "Slots fetched successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const data = await slotsService.updateSlot(
                req.params.id,
                req.validatedBody
            );

            return res.status(200).json({
                success: true,
                message: "Slot updated successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const data = await slotsService.deleteSlot(req.params.id);

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