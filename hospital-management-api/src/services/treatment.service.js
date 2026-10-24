
import { treatmentRepository } from "../repositories/treatment.repository.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function parseId(value) {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw createError("Invalid treatment ID", 400);
    }

    return id;
}

async function getAuthenticatedDoctor(userId) {
    if (!userId) {
        throw createError("Authenticated user ID is missing", 401);
    }

    const doctor = await treatmentRepository.findDoctorByUserId(userId);

    if (!doctor) {
        throw createError("Active doctor profile not found", 403);
    }

    return doctor;
}

async function validatePatient(patientId) {
    const patient = await treatmentRepository.findPatientById(patientId);

    if (!patient) {
        throw createError("Active patient not found", 404);
    }
}

async function getDoctorOwnedTreatment(id, doctorId) {
    const treatment = await treatmentRepository.findById(id);

    if (!treatment) {
        throw createError("Treatment not found", 404);
    }

    if (treatment.doctorId !== doctorId) {
        throw createError(
            "You can only modify treatments created under your doctor profile",
            403
        );
    }

    return treatment;
}

export const treatmentService = {
    async createTreatment(input, userId) {
        const doctor = await getAuthenticatedDoctor(userId);

        await validatePatient(input.patientId);

        return treatmentRepository.create({
            patientId: input.patientId,
            doctorId: input.doctorId,
            treatmentDetails: input.treatmentDetails,
            medicineName: input.medicineName,
            testDetails: input.testDetails,
            status: true,
        });
    },

    async getTreatments(idValue) {
        if (idValue === undefined) {
            return treatmentRepository.findAll();
        }

        const id = parseId(idValue);
        const treatment = await treatmentRepository.findById(id);

        if (!treatment) {
            throw createError("Treatment not found", 404);
        }

        return treatment;
    },

    async updateTreatment(idValue, input, userId) {
        const id = parseId(idValue);
        const doctor = await getAuthenticatedDoctor(userId);

        const existing = await getDoctorOwnedTreatment(id, doctor.id);

        if (input.patientId !== undefined) {
            await validatePatient(input.patientId);
        }

        const data = {};

        if (input.patientId !== undefined) {
            data.patientId = input.patientId;
        }

        if (input.treatmentDetails !== undefined) {
            data.treatmentDetails = input.treatmentDetails;
        }

        if (input.medicineName !== undefined) {
            data.medicineName = input.medicineName;
        }

        if (input.testDetails !== undefined) {
            data.testDetails = input.testDetails;
        }

        try {
            return await treatmentRepository.update(existing.id, data);
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Treatment not found", 404);
            }

            throw error;
        }
    },

    async deleteTreatment(idValue, userId) {
        const id = parseId(idValue);
        const doctor = await getAuthenticatedDoctor(userId);

        await getDoctorOwnedTreatment(id, doctor.id);

        try {
            await treatmentRepository.softDelete(id);

            return {
                id,
                message: "Treatment deactivated successfully",
            };
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Treatment not found", 404);
            }

            throw error;
        }
    },
};
