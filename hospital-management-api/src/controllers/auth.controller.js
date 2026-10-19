
import { authService } from "../services/auth.service.js";

export const authController = {
    async login(req, res, next) {
        try {
            const data = await authService.login(req.validatedBody);

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async refresh(req, res, next) {
        try {
            const data = await authService.refresh(
                req.validatedBody.refreshToken
            );

            return res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async logout(req, res, next) {
        try {
            await authService.logout(
                req.user.id,
                req.validatedBody.refreshToken
            );

            return res.status(200).json({
                success: true,
                message: "Logout successful",
            });
        } catch (error) {
            next(error);
        }
    },
};
