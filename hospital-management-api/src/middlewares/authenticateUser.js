
import jwt from "jsonwebtoken";
import prisma from "../config/database.js";

export async function authenticateUser(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        const token = authorization.slice(7).trim();

        const payload = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
        });

        const userId = Number(payload.sub);

        if (
            payload.tokenType !== "access" ||
            !Number.isSafeInteger(userId) ||
            userId <= 0
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token",
            });
        }

        const user = await prisma.user.findFirst({
            where: { id: userId, status: true },
            include: { role: true },
        });

        if (!user || !user.role.status ||
            user.role.roleName !== payload.role) {
            return res.status(401).json({
                success: false,
                message: "Invalid or inactive account",
            });
        }

        req.user = {
            id: user.id,
            emailAddress: user.emailAddress,
            role: user.role.roleName,
        };

        next();
    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token",
            });
        }

        next(error);
    }
}
