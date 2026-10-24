
import { specialistService } from "../services/specialist.service.js";

export const specialistController = {
    async create(req, res, next) {
        try {
            const data = await specialistService.createSpecialist(
                req.validatedBody
            );

            return res.status(201).json({
                success: true,
                message: "Specialist created successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async getSpecialists(req, res, next) {
        try {
            const data = await specialistService.getSpecialists(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                message: req.params.id
                    ? "Specialist fetched successfully"
                    : "Specialists fetched successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const data = await specialistService.updateSpecialist(
                req.params.id,
                req.validatedBody
            );

            return res.status(200).json({
                success: true,
                message: "Specialist updated successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const data = await specialistService.deleteSpecialist(
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
