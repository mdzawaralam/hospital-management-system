
import { qualificationService } from "../services/qualification.service.js";

export const qualificationController = {
    async create(req, res, next) {
        try {
            const qualification =
                await qualificationService.createQualification(
                    req.validatedBody
                );

            return res.status(201).json({
                success: true,
                message: "Qualification created successfully",
                data: qualification,
            });
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const qualifications =
                await qualificationService.getQualifications();

            return res.status(200).json({
                success: true,
                message: "Qualifications retrieved successfully",
                count: qualifications.length,
                data: qualifications,
            });
        } catch (error) {
            next(error);
        }
    },


    async update(req, res, next) {
        try {
            const qualification =
                await qualificationService.updateQualification(
                    req.params.id,
                    req.validatedBody
                );

            return res.status(200).json({
                success: true,
                message: "Qualification updated successfully",
                data: qualification,
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const qualification =
                await qualificationService.deleteQualification(req.params.id);

            return res.status(200).json({
                success: true,
                message: "Qualification deleted successfully",
                data: qualification,
            });
        } catch (error) {
            next(error);
        }
    },

};


