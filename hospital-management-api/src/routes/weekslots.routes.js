
import { Router } from "express";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";

import {
    createWeekSlotSchema,
    updateWeekSlotSchema,
} from "../validators/weekslots.validator.js";

import { weekSlotsController } from "../controllers/weekslots.controller.js";

const router = Router();

const readRoles = ["Admin", "Doctor", "Receptionist"];
const writeRoles = ["Admin", "Receptionist"];

// Create: Admin and Receptionist
router.post(
    "/",
    authenticateUser,
    authorizeRole(...writeRoles),
    validate(createWeekSlotSchema),
    weekSlotsController.create
);

// Read all or by ID: Admin, Doctor and Receptionist
router.get(
    ["/", "/:id"],
    authenticateUser,
    authorizeRole(...readRoles),
    weekSlotsController.getWeekSlots
);

// Update: Admin and Receptionist
router.put(
    "/:id",
    authenticateUser,
    authorizeRole(...writeRoles),
    validate(updateWeekSlotSchema),
    weekSlotsController.update
);

// Deactivate: Admin and Receptionist
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole(...writeRoles),
    weekSlotsController.delete
);

export default router;
