import { messageService } from "../services/message.service.js";

export const messageController = {
    async create(req, res, next) {
        try {
            const data = await messageService.createMessage(req.validatedBody);

            return res.status(201).json({
                success: true,
                message: "Message created successfully.",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async getMessages(req, res, next) {
        try {
            const data = await messageService.getMessages(req.params.id);

            return res.status(200).json({
                success: true,
                message: req.params.id
                    ? "Message fetched successfully."
                    : "Messages fetched successfully.",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const data = await messageService.updateMessage(
                req.params.id,
                req.validatedBody
            );

            return res.status(200).json({
                success: true,
                message: "Message updated successfully.",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const data = await messageService.deleteMessage(req.params.id);

            return res.status(200).json({
                success: true,
                message: "Message deleted successfully.",
                data,
            });
        } catch (error) {
            next(error);
        }
    },
};