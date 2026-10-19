
import { doctorService } from "../services/doctor.service.js";


export const doctorController = {
    async create(req, res, next) {
        try {
            const doctor = await doctorService.createDoctor(req.validatedBody);

            return res.status(201).json({
                success: true,
                message: "Doctor registered successfully. Registration email queued.",
                data: doctor,
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const doctor = await doctorService.updateDoctor(
                req.params.id,
                req.validatedBody
            );

            return res.status(200).json({
                success: true,
                message: "Doctor updated successfully",
                data: doctor,
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const result = await doctorService.deleteDoctor(req.params.id);

            return res.status(200).json({
                success: true,
                message: result.message,
                data: { id: result.id },
            });
        } catch (error) {
            next(error);
        }
    },

    async getDoctors(req, res, next) {
        try {
            let id;

            if (req.params.id !== undefined) {
                id = Number(req.params.id);

                if (!Number.isInteger(id) || id <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Doctor ID must be a positive integer",
                    });
                }
            }

            const doctors = await doctorService.getDoctors(id);

            if (id !== undefined && !doctors) {
                return res.status(404).json({
                    success: false,
                    message: "Doctor not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: id !== undefined
                    ? "Doctor fetched successfully"
                    : "Doctors fetched successfully",
                data: doctors,
            });
        } catch (error) {
            next(error);
        }
    },
};
