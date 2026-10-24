import { Router } from "express";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";

import {
    createMessageSchema,
    updateMessageSchema,
} from "../validators/message.validator.js";

import { messageController } from "../controllers/message.controller.js";

const router = Router();

const allowedRoles = [
    "Admin",
    "Doctor",
    "Receptionist",
    "Patient",
];

// POST: Create a message
router.post(
    "/",
    authenticateUser,
    authorizeRole(...allowedRoles),
    validate(createMessageSchema),
    messageController.create
);

// GET: Fetch all messages or a single message by ID
router.get(
    ["/", "/:id"],
    authenticateUser,
    authorizeRole(...allowedRoles),
    messageController.getMessages
);

// PUT: Update a message
router.put(
    "/:id",
    authenticateUser,
    authorizeRole(...allowedRoles),
    validate(updateMessageSchema),
    messageController.update
);

// DELETE: Soft-delete a message
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole(...allowedRoles),
    messageController.delete
);

export default router;