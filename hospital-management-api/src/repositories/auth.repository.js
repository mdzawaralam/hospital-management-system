
import prisma from "../config/database.js";

export const authRepository = {
    findUserByEmail(emailAddress) {
        return prisma.user.findUnique({
            where: { emailAddress },
            include: { role: true },
        });
    },

    findActiveUserById(id) {
        return prisma.user.findFirst({
            where: { id, status: true },
            include: { role: true },
        });
    },

    createRefreshToken(data) {
        return prisma.refreshToken.create({ data });
    },

    findRefreshTokenByHash(tokenHash) {
        return prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: { user: { include: { role: true } } },
        });
    },

    async revokeRefreshToken(userId, tokenHash) {
        return prisma.refreshToken.updateMany({
            where: {
                userId,
                tokenHash,
                revokedAt: null,
            },
            data: { revokedAt: new Date() },
        });
    },
};
