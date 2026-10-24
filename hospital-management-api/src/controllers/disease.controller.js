
import { diseaseService } from "../services/disease.service.js";

export const diseaseController = {
    async create(req, res, next) {
        try {
            const disease = await diseaseService.createDisease(
                req.validatedBody
            );

            return res.status(201).json({
                success: true,
                message: "Disease created successfully",
                data: disease,
            });
        } catch (error) {
            next(error);
        }
    },

    async getDiseases(req, res, next) {
        try {
            const id = req.params.id;

            const diseases = await diseaseService.getDiseases(id);

            if (id !== undefined && !diseases) {
                return res.status(404).json({
                    success: false,
                    message: "Disease not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: id !== undefined
                    ? "Disease fetched successfully"
                    : "Diseases fetched successfully",
                data: diseases,
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const disease = await diseaseService.updateDisease(
                req.params.id,
                req.validatedBody
            );

            return res.status(200).json({
                success: true,
                message: "Disease updated successfully",
                data: disease,
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const result = await diseaseService.deleteDisease(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                message: result.message,
                data: { id: result.id },
            });
        } catch (error) {
            next(error);
        }
    },
};
