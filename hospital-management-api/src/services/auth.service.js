
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { authRepository } from "../repositories/auth.repository.js";
import prisma from "../config/database.js";

function appError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
}

function hashMatches(token, storedHash) {
    if (!storedHash) return false;

    const actual = Buffer.from(hashToken(token), "hex");
    const expected = Buffer.from(storedHash, "hex");

    return actual.length === expected.length &&
        timingSafeEqual(actual, expected);
}

function createTokenPair(user) {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw appError("Authentication configuration is missing", 500);
    }

    const commonClaims = {
        role: user.role.roleName,
        jti: randomUUID(),
    };

    const accessToken = jwt.sign(
        { ...commonClaims, tokenType: "access" },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            subject: String(user.id),
            expiresIn: process.env.JWT_EXPIRES_IN || "15m",
        }
    );

    const refreshToken = jwt.sign(
        { ...commonClaims, tokenType: "refresh" },
        process.env.JWT_REFRESH_SECRET,
        {
            algorithm: "HS256",
            subject: String(user.id),
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        }
    );

    const decoded = jwt.decode(refreshToken);

    return {
        accessToken,
        refreshToken,
        tokenType: "Bearer",
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
        refreshExpiresAt: new Date(decoded.exp * 1000),
    };
}

function verifyRefreshToken(token) {
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET,
            { algorithms: ["HS256"] }
        );

        const userId = Number(payload.sub);

        if (
            payload.tokenType !== "refresh" ||
            typeof payload.role !== "string" ||
            !Number.isSafeInteger(userId) ||
            userId <= 0
        ) {
            throw new Error("Invalid refresh token");
        }

        return { ...payload, userId };
    } catch {
        throw appError("Invalid or expired refresh token", 401);
    }
}

export const authService = {
    async login(input) {
        const user = await authRepository.findUserByEmail(
            input.emailAddress
        );

        if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
            throw appError("Invalid email address or password", 401);
        }

        if (!user.status || !user.role.status) {
            throw appError("Account is inactive", 403);
        }

        const tokens = createTokenPair(user);

        await authRepository.createRefreshToken({
            userId: user.id,
            tokenHash: hashToken(tokens.refreshToken),
            expiresAt: tokens.refreshExpiresAt,
        });

        return {
            user: {
                id: user.id,
                emailAddress: user.emailAddress,
                role: user.role.roleName,
            },
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            tokenType: tokens.tokenType,
            expiresIn: tokens.expiresIn,
        };
    },

    async refresh(refreshToken) {
        const payload = verifyRefreshToken(refreshToken);
        const tokenHash = hashToken(refreshToken);
        const tokens = await prisma.$transaction(async (tx) => {
            const stored = await tx.refreshToken.findUnique({
                where: { tokenHash },
                include: { user: { include: { role: true } } },
            });

            if (
                !stored ||
                stored.userId !== payload.userId ||
                stored.revokedAt ||
                stored.expiresAt <= new Date() ||
                !stored.user.status ||
                !stored.user.role.status ||
                stored.user.role.roleName !== payload.role
            ) {
                throw appError("Invalid or expired refresh token", 401);
            }

            const count = await tx.refreshToken.updateMany({
                where: {
                    id: stored.id,
                    revokedAt: null,
                    expiresAt: { gt: new Date() },
                },
                data: { revokedAt: new Date() },
            });

            if (count.count !== 1) {
                throw appError("Refresh token has already been used", 401);
            }

            const newTokens = createTokenPair(stored.user);

            await tx.refreshToken.create({
                data: {
                    userId: stored.userId,
                    tokenHash: hashToken(newTokens.refreshToken),
                    expiresAt: newTokens.refreshExpiresAt,
                },
            });

            return newTokens;
        });

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            tokenType: tokens.tokenType,
            expiresIn: tokens.expiresIn,
        };
    },

    async logout(userId, refreshToken) {
        // Only revoke a refresh token belonging to the authenticated user.
        // Logout remains successful if the token has already been revoked.
        await authRepository.revokeRefreshToken(
            userId,
            hashToken(refreshToken)
        );
    },
};
