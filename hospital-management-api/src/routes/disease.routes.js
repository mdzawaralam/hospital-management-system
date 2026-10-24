
import { Router } from "express";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";

import {
    createDiseaseSchema,
    updateDiseaseSchema,
} from "../validators/disease.validator.js";

import { diseaseController } from "../controllers/disease.controller.js";

const router = Router();

const allowedRoles = ["Admin", "Doctor", "Receptionist"];

// POST /api/receptionist/disease
router.post(
    "/",
    authenticateUser,
    authorizeRole(...allowedRoles),
    validate(createDiseaseSchema),
    diseaseController.create
);

// GET /api/receptionist/disease
// GET /api/receptionist/disease/:id
router.get(
    ["/", "/:id"],
    authenticateUser,
    authorizeRole(...allowedRoles),
    diseaseController.getDiseases
);

// PUT /api/receptionist/disease/:id
router.put(
    "/:id",
    authenticateUser,
    authorizeRole(...allowedRoles),
    validate(updateDiseaseSchema),
    diseaseController.update
);

// DELETE /api/receptionist/disease/:id
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole(...allowedRoles),
    diseaseController.delete
);

export default router;
