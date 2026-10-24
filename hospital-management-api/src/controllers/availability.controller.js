
import { availabilityService } from "../services/availability.service.js";

export const availabilityController = {
    async create(req, res, next) {
        try {
            const data = await availabilityService.createAvailability(
                req.validatedBody
            );

            return res.status(201).json({
                success: true,
                message: "Doctor availability created successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async getAvailability(req, res, next) {
        try {
            const data = await availabilityService.getAvailability(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                message: req.params.id
                    ? "Doctor availability fetched successfully"
                    : "Doctor availabilities fetched successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const data = await availabilityService.updateAvailability(
                req.params.id,
                req.validatedBody
            );

            return res.status(200).json({
                success: true,
                message: "Doctor availability updated successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const data = await availabilityService.deleteAvailability(
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
