
import { Router } from "express";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";

import {
    createReceptionistSchema,
    updateReceptionistSchema,
} from "../validators/receptionist.validator.js";

import { receptionistController } from "../controllers/receptionist.controller.js";

const router = Router();

// POST /api/admin/receptionists - Admin only
router.post(
    "/",
    authenticateUser,
    authorizeRole("Admin"),
    validate(createReceptionistSchema),
    receptionistController.create
);

// PUT /api/admin/receptionists/:id - Admin only
router.put(
    "/:id",
    authenticateUser,
    authorizeRole("Admin"),
    validate(updateReceptionistSchema),
    receptionistController.update
);

// DELETE /api/admin/receptionists/:id - Admin only
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole("Admin"),
    receptionistController.delete
);

// GET /api/admin/receptionists - Admin, Doctor, Receptionist
// GET /api/admin/receptionists/:id - Admin, Doctor, Receptionist
router.get(
    ["/", "/:id"],
    authenticateUser,
    authorizeRole("Admin", "Doctor", "Receptionist"),
    receptionistController.getReceptionists
);

export default router;
