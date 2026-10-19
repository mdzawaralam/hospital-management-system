
import { receptionistService } from "../services/receptionist.service.js";

export const receptionistController = {
    async create(req, res, next) {
        try {
            const receptionist =
                await receptionistService.createReceptionist(
                    req.validatedBody
                );

            return res.status(201).json({
                success: true,
                message:
                    "Receptionist registered successfully. Registration email queued.",
                data: receptionist,
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const receptionist =
                await receptionistService.updateReceptionist(
                    req.params.id,
                    req.validatedBody
                );

            return res.status(200).json({
                success: true,
                message: "Receptionist updated successfully",
                data: receptionist,
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const result =
                await receptionistService.deleteReceptionist(req.params.id);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: { id: result.id },
            });
        } catch (error) {
            next(error);
        }
    },

    async getReceptionists(req, res, next) {
        try {
            const id = req.params.id;

            const receptionists =
                await receptionistService.getReceptionists(id);

            if (id !== undefined && !receptionists) {
                return res.status(404).json({
                    success: false,
                    message: "Receptionist not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: id !== undefined
                    ? "Receptionist fetched successfully"
                    : "Receptionists fetched successfully",
                data: receptionists,
            });
        } catch (error) {
            next(error);
        }
    },
};
