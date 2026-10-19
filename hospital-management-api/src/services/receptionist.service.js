
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

import { receptionistRepository } from "../repositories/receptionist.repository.js";
import { publishEmail } from "../queues/email.queue.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function parseId(value) {
    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw createError("Invalid receptionist ID", 400);
    }

    return id;
}

export const receptionistService = {
    async createReceptionist(input) {
        const existingUser =
            await receptionistRepository.findUserByEmail(input.emailAddress);

        if (existingUser) {
            throw createError("Email address is already registered", 409);
        }

        const role =
            await receptionistRepository.findRoleByName("Receptionist");

        if (!role || !role.status) {
            throw createError("Active RECEPTIONIST role not found", 500);
        }

        const qualification =
            await receptionistRepository.findQualificationById(
                input.qualificationId
            );

        if (!qualification || !qualification.status) {
            throw createError("Active qualification not found", 400);
        }

        const temporaryPassword = randomBytes(18).toString("base64url");
        const passwordHash = await bcrypt.hash(temporaryPassword, 12);

        let receptionist;

        try {
            receptionist = await receptionistRepository.createWithUser(
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
                throw createError(
                    "Email address is already registered",
                    409
                );
            }

            throw error;
        }

        // Database transaction has committed. Queue the registration email.
        try {
            await publishEmail({
                to: input.emailAddress,
                subject: "Your Hospital Management System login",
                text: [
                    `Hello ${input.fullName},`,
                    "",
                    "Your receptionist account has been created successfully.",
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
                "Receptionist registered, but the email could not be queued. Please check the server logs.",
                503
            );
        }

        return receptionist;
    },

    async updateReceptionist(idValue, input) {
        const id = parseId(idValue);

        const existing = await receptionistRepository.findById(id);

        if (!existing || !existing.status || !existing.user.status) {
            throw createError("Active receptionist not found", 404);
        }

        if (input.qualificationId !== undefined) {
            const qualification =
                await receptionistRepository.findQualificationById(
                    input.qualificationId
                );

            if (!qualification || !qualification.status) {
                throw createError("Active qualification not found", 400);
            }
        }

        try {
            return await receptionistRepository.update(id, input);
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Receptionist not found", 404);
            }

            throw error;
        }
    },

    async deleteReceptionist(idValue) {
        const id = parseId(idValue);

        const existing = await receptionistRepository.findById(id);

        if (!existing || !existing.status || !existing.user.status) {
            throw createError("Active receptionist not found", 404);
        }

        try {
            await receptionistRepository.softDelete(id, existing.userId);

            return {
                id,
                message: "Receptionist deactivated successfully",
            };
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Receptionist not found", 404);
            }

            throw error;
        }
    },

    async getReceptionists(idValue) {
        if (idValue !== undefined) {
            const id = parseId(idValue);

            return receptionistRepository.findReceptionistById(id);
        }

        return receptionistRepository.findAllReceptionists();
    },
};
