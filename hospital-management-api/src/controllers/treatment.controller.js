
import { treatmentService } from "../services/treatment.service.js";

function getUserId(req) {
    return req.user?.userId ?? req.user?.id;
}

export const treatmentController = {
    async create(req, res, next) {
        try {
            const data = await treatmentService.createTreatment(
                req.validatedBody,
                getUserId(req)
            );

            return res.status(201).json({
                success: true,
                message: "Patient treatment created successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async getTreatments(req, res, next) {
        try {
            const data = await treatmentService.getTreatments(
                req.params.id
            );

            return res.status(200).json({
                success: true,
                message: req.params.id
                    ? "Treatment fetched successfully"
                    : "Treatments fetched successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const data = await treatmentService.updateTreatment(
                req.params.id,
                req.validatedBody,
                getUserId(req)
            );

            return res.status(200).json({
                success: true,
                message: "Treatment updated successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const data = await treatmentService.deleteTreatment(
                req.params.id,
                getUserId(req)
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
