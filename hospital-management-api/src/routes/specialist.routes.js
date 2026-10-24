
import { Router } from "express";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";

import {
    createSpecialistSchema,
    updateSpecialistSchema,
} from "../validators/specialist.validator.js";

import { specialistController } from "../controllers/specialist.controller.js";

const router = Router();

const allowedRoles = ["Receptionist"];

// Create specialist
router.post(
    "/",
    authenticateUser,
    authorizeRole(...allowedRoles),
    validate(createSpecialistSchema),
    specialistController.create
);

// Get all specialists or one specialist by ID
router.get(
    ["/", "/:id"],
    authenticateUser,
    authorizeRole(...allowedRoles),
    specialistController.getSpecialists
);

// Update specialist
router.put(
    "/:id",
    authenticateUser,
    authorizeRole(...allowedRoles),
    validate(updateSpecialistSchema),
    specialistController.update
);

// Deactivate specialist
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole(...allowedRoles),
    specialistController.delete
);

export default router;
