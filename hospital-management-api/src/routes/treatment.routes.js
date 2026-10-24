
import { Router } from "express";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";

import {
    createTreatmentSchema,
    updateTreatmentSchema,
} from "../validators/treatment.validator.js";

import { treatmentController } from "../controllers/treatment.controller.js";

const router = Router();

const readRoles = ["Receptionist", "Admin", "Doctor"];

// Create: Doctor only
router.post(
    "/",
    authenticateUser,
    authorizeRole("Doctor"),
    validate(createTreatmentSchema),
    treatmentController.create
);

// Get all or one: Receptionist, Admin, Doctor
router.get(
    ["/", "/:id"],
    authenticateUser,
    authorizeRole(...readRoles),
    treatmentController.getTreatments
);

// Update: Doctor only
router.put(
    "/:id",
    authenticateUser,
    authorizeRole("Doctor"),
    validate(updateTreatmentSchema),
    treatmentController.update
);

// Deactivate: Doctor only
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole("Doctor"),
    treatmentController.delete
);

export default router;
