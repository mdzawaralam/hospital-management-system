
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

import { patientRepository } from "../repositories/patient.repository.js";
import { publishEmail } from "../queues/email.queue.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function parseId(value) {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw createError("Invalid patient ID", 400);
    }

    return id;
}

async function validateReferences(input) {
    if (input.diseaseId !== undefined) {
        const disease = await patientRepository.findDiseaseById(
            input.diseaseId
        );

        if (!disease || !disease.status) {
            throw createError("Active disease not found", 400);
        }
    }

    if (input.doctorId !== undefined && input.doctorId !== null) {
        const doctor = await patientRepository.findDoctorById(
            input.doctorId
        );

        if (!doctor || !doctor.status || !doctor.user.status) {
            throw createError("Active doctor not found", 400);
        }
    }
}

export const patientService = {
    async createPatient(input) {
        const existingUser = await patientRepository.findUserByEmail(
            input.emailAddress
        );

        if (existingUser) {
            throw createError("Email address is already registered", 409);
        }

        const role = await patientRepository.findRoleByName("Patient");

        if (!role || !role.status) {
            throw createError("Active PATIENT role not found", 500);
        }

        await validateReferences(input);

        // const temporaryPassword = randomBytes(18).toString("base64url");
        const temporaryPassword = "Patient123#";
        const passwordHash = await bcrypt.hash(temporaryPassword, 12);

        let patient;

        try {
            patient = await patientRepository.createWithUser(
                {
                    emailAddress: input.emailAddress,
                    passwordHash,
                    roleId: role.id,
                    status: true,
                },
                {
                    fullName: input.fullName,
                    mobileNumber: input.mobileNumber,
                    diseaseId: input.diseaseId,
                    doctorId: input.doctorId ?? null,
                    address: input.address,
                    city: input.city,
                    country: input.country,
                    status: true,
                }
            );
        } catch (error) {
            if (error.code === "P2002") {
                throw createError(
                    "Email address is already registered",
                    409
                );
            }

            throw error;
        }

        try {
            await publishEmail({
                to: input.emailAddress,
                subject: "Your Hospital Management System login",
                text: [
                    `Hello ${input.fullName},`,
                    "",
                    "Your patient account has been created successfully.",
                    `Login email: ${input.emailAddress}`,
                    `Temporary password: ${temporaryPassword}`,
                    "",
                    "Please sign in and change your temporary password.",
                    "Do not share these login details with anyone.",
                ].join("\n"),
            });
        } catch (error) {
            console.error(
                "RabbitMQ email queue error:",
                error.message
            );

            throw createError(
                "Patient registered, but the email could not be queued. Please check the server logs.",
                503
            );
        }

        return patient;
    },

    async updatePatient(idValue, input) {
        const id = parseId(idValue);
        const existing = await patientRepository.findById(id);

        if (!existing || !existing.status || !existing.user.status) {
            throw createError("Active patient not found", 404);
        }

        await validateReferences(input);

        try {
            return await patientRepository.update(id, input);
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Patient not found", 404);
            }

            throw error;
        }
    },

    async deletePatient(idValue) {
        const id = parseId(idValue);
        const existing = await patientRepository.findById(id);

        if (!existing || !existing.status || !existing.user.status) {
            throw createError("Active patient not found", 404);
        }

        try {
            await patientRepository.softDelete(id, existing.userId);

            return {
                id,
                message: "Patient deactivated successfully",
            };
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Patient not found", 404);
            }

            throw error;
        }
    },

    async getPatients(idValue) {
        if (idValue !== undefined) {
            const id = parseId(idValue);

            return patientRepository.findPatientById(id);
        }

        return patientRepository.findAllPatients();
    },
};
