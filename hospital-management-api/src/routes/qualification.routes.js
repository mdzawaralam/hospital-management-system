
import { Router } from "express";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { validate } from "../middlewares/validate.js";

import { createQualificationSchema, updateQualificationSchema } from "../validators/qualification.validator.js";
import { qualificationController } from "../controllers/qualification.controller.js";

const router = Router();

// Admin only: create qualification
router.post(
    "/",
    authenticateUser,
    authorizeRole("Admin"),
    validate(createQualificationSchema),
    qualificationController.create
);

// Admin only: get all active qualifications
router.get(
    "/",
    authenticateUser,
    authorizeRole("Admin", "Doctor", "Receptionist"),
    qualificationController.getAll
);


// Edit qualification: Admin only
router.put(
    "/:id",
    authenticateUser,
    authorizeRole("Admin"),
    validate(updateQualificationSchema),
    qualificationController.update
);

// Delete qualification: Admin only
router.delete(
    "/:id",
    authenticateUser,
    authorizeRole("Admin"),
    qualificationController.delete
);

export default router;
