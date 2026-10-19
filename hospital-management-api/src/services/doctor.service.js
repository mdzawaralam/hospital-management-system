
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { doctorRepository } from "../repositories/doctor.repository.js";
import { publishEmail } from "../queues/email.queue.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function parseId(value) {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw createError("Invalid doctor ID", 400);
    }

    return id;
}

export const doctorService = {
    async createDoctor(input) {
        const existingUser =
            await doctorRepository.findUserByEmail(input.emailAddress);

        if (existingUser) {
            throw createError("Email address is already registered", 409);
        }

        const role = await doctorRepository.findRoleByName("Doctor");

        if (!role || !role.status) {
            throw createError("Active DOCTOR role not found", 500);
        }

        const qualification =
            await doctorRepository.findQualificationById(input.qualificationId);

        if (!qualification || !qualification.status) {
            throw createError("Active qualification not found", 400);
        }

        // Generate a random temporary password. Never log this value.
        const temporaryPassword = randomBytes(18).toString("base64url");
        const passwordHash = await bcrypt.hash(temporaryPassword, 12);

        let doctor;

        try {
            doctor = await doctorRepository.createWithUser(
                {
                    emailAddress: input.emailAddress,
                    passwordHash,
                    roleId: role.id,
                    status: true,
                },
                {
                    fullName: input.fullName,
                    mobileNumber: input.mobileNumber,
                    qualificationId: input.qualificationId,
                    address: input.address,
                    city: input.city,
                    country: input.country,
                    status: true,
                }
            );
        } catch (error) {
            if (error.code === "P2002") {
                throw createError("Email address is already registered", 409);
            }

            throw error;
        }

        // The database transaction has committed before the email is queued.
        try {
            await publishEmail({
                to: input.emailAddress,
                subject: "Your Hospital Management System login",
                text: [
                    `Hello ${input.fullName},`,
                    "",
                    "Your doctor account has been created successfully.",
                    `Login email: ${input.emailAddress}`,
                    `Temporary password: ${temporaryPassword}`,
                    "",
                    "Please sign in and change your temporary password.",
                    "Do not share these login details with anyone.",
                ].join("\n"),
            });
        } catch (error) {
            console.error("RabbitMQ email queue error:", error.message);

            throw createError(
                "Doctor registered, but the email could not be queued. Please check the server logs.",
                503
            );
        }

        return doctor;
    },

    async updateDoctor(idValue, input) {
        const id = parseId(idValue);
        const existing = await doctorRepository.findById(id);

        if (!existing || !existing.status || !existing.user.status) {
            throw createError("Active doctor not found", 404);
        }

        if (input.qualificationId !== undefined) {
            const qualification =
                await doctorRepository.findQualificationById(input.qualificationId);

            if (!qualification || !qualification.status) {
                throw createError("Active qualification not found", 400);
            }
        }

        try {
            return await doctorRepository.update(id, input);
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Doctor not found", 404);
            }
            throw error;
        }
    },

    async deleteDoctor(idValue) {
        const id = parseId(idValue);
        const existing = await doctorRepository.findById(id);

        if (!existing || !existing.status || !existing.user.status) {
            throw createError("Active doctor not found", 404);
        }

        try {
            await doctorRepository.softDelete(id, existing.userId);
            return { id, message: "Doctor deactivated successfully" };
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Doctor not found", 404);
            }
            throw error;
        }
    },

    async getDoctors(id) {
        if (id !== undefined) {
            return doctorRepository.findDoctorById(id);
        }

        return doctorRepository.findAllDoctors();
    },
};
