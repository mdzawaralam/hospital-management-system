
import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";

import {
    createDoctorSchema,
    updateDoctorSchema,
} from "../validators/doctor.validator.js";

import { doctorController } from "../controllers/doctor.controller.js";

const router = Router();

// POST /api/admin/doctor - Admin only
router.post(
    "/",
    authenticateUser,
    authorizeRole("Admin"),
    validate(createDoctorSchema),
    doctorController.create
);

// PUT /api/admin/doctor/:id - Admin only
router.put(
    "/:id",
    authenticateUser,
    authorizeRole("Admin"),
    validate(updateDoctorSchema),
    doctorController.update
);

// DELETE /api/admin/doctor/:id - Admin only
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole("Admin"),
    doctorController.delete
);

router.get(
    ["/", "/:id"],
    authenticateUser,
    authorizeRole("Admin", "Doctor", "Receptionist"),
    doctorController.getDoctors
);

export default router;
