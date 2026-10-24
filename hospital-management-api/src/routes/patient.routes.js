
import { Router } from "express";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";

import {
    createPatientSchema,
    updatePatientSchema,
} from "../validators/patient.validator.js";

import { patientController } from "../controllers/patient.controller.js";

const router = Router();

const allowedRoles = ["Admin", "Doctor", "Receptionist"];

// POST /api/receptionist/patients
router.post(
    "/",
    authenticateUser,
    authorizeRole(...allowedRoles),
    validate(createPatientSchema),
    patientController.create
);

// GET /api/receptionist/patients
// GET /api/receptionist/patients/:id
router.get(
    ["/", "/:id"],
    authenticateUser,
    authorizeRole(...allowedRoles),
    patientController.getPatients
);

// PUT /api/receptionist/patients/:id
router.put(
    "/:id",
    authenticateUser,
    authorizeRole(...allowedRoles),
    validate(updatePatientSchema),
    patientController.update
);

// DELETE /api/receptionist/patients/:id
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole(...allowedRoles),
    patientController.delete
);

export default router;
