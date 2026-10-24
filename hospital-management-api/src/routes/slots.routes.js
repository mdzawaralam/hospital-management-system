import { Router } from "express";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";

import {
    createSlotSchema,
    updateSlotSchema,
} from "../validators/slots.validator.js";

import { slotsController } from "../controllers/slots.controller.js";

const router = Router();

const readRoles = ["Admin", "Doctor", "Receptionist"];
const writeRoles = ["Admin", "Receptionist"];

// Create slot: Admin, Receptionist
router.post(
    "/",
    authenticateUser,
    authorizeRole(...writeRoles),
    validate(createSlotSchema),
    slotsController.create
);

// Get all slots or one slot by ID: Admin, Doctor, Receptionist
router.get(
    ["/", "/:id"],
    authenticateUser,
    authorizeRole(...readRoles),
    slotsController.getSlots
);

// Update slot: Admin, Receptionist
router.put(
    "/:id",
    authenticateUser,
    authorizeRole(...writeRoles),
    validate(updateSlotSchema),
    slotsController.update
);

// Deactivate slot: Admin, Receptionist
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole(...writeRoles),
    slotsController.delete
);

export default router;