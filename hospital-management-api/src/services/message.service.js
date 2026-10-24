import { messageRepository } from "../repositories/message.repository.js";

function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function parseId(value) {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
        throw createError("Invalid message ID.", 400);
    }

    return id;
}

async function validateUser(userId, label) {
    const user = await messageRepository.findActiveUserById(userId);

    if (!user) {
        throw createError(`${label} does not exist or is inactive.`, 404);
    }
}

async function getActiveMessage(id) {
    const message = await messageRepository.findById(id);

    if (!message) {
        throw createError("Message not found.", 404);
    }

    return message;
}

export const messageService = {
    async createMessage(input) {
        if (input.fromUserId === input.toUserId) {
            throw createError(
                "Sender and receiver must be different users.",
                400
            );
        }

        await validateUser(input.fromUserId, "Sender");
        await validateUser(input.toUserId, "Receiver");

        try {
            return await messageRepository.create({
                fromUserId: input.fromUserId,
                toUserId: input.toUserId,
                message: input.message,
            });
        } catch (error) {
            if (error.code === "P2003") {
                throw createError("Invalid sender or receiver user ID.", 400);
            }

            throw error;
        }
    },

    async getMessages(idValue) {
        if (idValue === undefined) {
            return messageRepository.findAll();
        }

        const id = parseId(idValue);
        return getActiveMessage(id);
    },

    async updateMessage(idValue, input) {
        const id = parseId(idValue);
        const existingMessage = await getActiveMessage(id);

        const fromUserId = input.fromUserId ?? existingMessage.fromUserId;
        const toUserId = input.toUserId ?? existingMessage.toUserId;

        if (fromUserId === toUserId) {
            throw createError(
                "Sender and receiver must be different users.",
                400
            );
        }

        if (input.fromUserId !== undefined) {
            await validateUser(input.fromUserId, "Sender");
        }

        if (input.toUserId !== undefined) {
            await validateUser(input.toUserId, "Receiver");
        }

        const updateData = {};

        if (input.fromUserId !== undefined) {
            updateData.fromUserId = input.fromUserId;
        }

        if (input.toUserId !== undefined) {
            updateData.toUserId = input.toUserId;
        }

        if (input.message !== undefined) {
            updateData.message = input.message;
        }

        try {
            return await messageRepository.update(id, updateData);
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Message not found.", 404);
            }

            if (error.code === "P2003") {
                throw createError("Invalid sender or receiver user ID.", 400);
            }

            throw error;
        }
    },

    async deleteMessage(idValue) {
        const id = parseId(idValue);

        await getActiveMessage(id);

        try {
            return await messageRepository.softDelete(id);
        } catch (error) {
            if (error.code === "P2025") {
                throw createError("Message not found.", 404);
            }

            throw error;
        }
    },
};