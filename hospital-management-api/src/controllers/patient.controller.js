
import { patientService } from "../services/patient.service.js";

export const patientController = {
    async create(req, res, next) {
        try {
            const patient = await patientService.createPatient(
                req.validatedBody
            );

            return res.status(201).json({
                success: true,
                message:
                    "Patient registered successfully. Registration email queued.",
                data: patient,
            });
        } catch (error) {
            next(error);
        }
    },

    async getPatients(req, res, next) {
        try {
            const id = req.params.id;

            const patients = await patientService.getPatients(id);

            if (id !== undefined && !patients) {
                return res.status(404).json({
                    success: false,
                    message: "Patient not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: id !== undefined
                    ? "Patient fetched successfully"
                    : "Patients fetched successfully",
                data: patients,
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const patient = await patientService.updatePatient(
                req.params.id,
                req.validatedBody
            );

            return res.status(200).json({
                success: true,
                message: "Patient updated successfully",
                data: patient,
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const result = await patientService.deletePatient(
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
