
import { Router } from "express";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";

import {
    createAvailabilitySchema,
    updateAvailabilitySchema,
} from "../validators/availability.validator.js";

import { availabilityController } from "../controllers/availability.controller.js";

const router = Router();

const readRoles = ["Receptionist", "Admin", "Doctor"];
const writeRoles = ["Receptionist", "Doctor"];

// Create: Receptionist, Doctor
router.post(
    "/",
    authenticateUser,
    authorizeRole(...writeRoles),
    validate(createAvailabilitySchema),
    availabilityController.create
);

// Get all or by ID: Receptionist, Admin, Doctor
router.get(
    ["/", "/:id"],
    authenticateUser,
    authorizeRole(...readRoles),
    availabilityController.getAvailability
);

// Update: Receptionist, Doctor
router.put(
    "/:id",
    authenticateUser,
    authorizeRole(...writeRoles),
    validate(updateAvailabilitySchema),
    availabilityController.update
);

// Deactivate: Receptionist, Doctor
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole(...writeRoles),
    availabilityController.delete
);

export default router;
