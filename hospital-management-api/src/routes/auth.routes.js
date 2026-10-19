
import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { validate } from "../middlewares/validate.js";
import {
    loginSchema,
    refreshSchema,
    logoutSchema,
} from "../validators/auth.validator.js";

const router = Router();

// Public: credentials are validated by the service.
router.post(
    "/login",
    validate(loginSchema),
    authController.login
);

// Refresh token is verified by the service.
router.post(
    "/refresh",
    validate(refreshSchema),
    authController.refresh
);

// Logout requires an access token and the session's refresh token.
router.post(
    "/logout",
    authenticateUser,
    validate(logoutSchema),
    authController.logout
);

export default router;
