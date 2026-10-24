
import { Router } from "express";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { paymentController } from "../controllers/payment.controller.js";

const router = Router();

router.post(
    "/create-order",
    authenticateUser,
    authorizeRole("Patient"),
    paymentController.createOrder
);

router.post(
    "/verify",
    authenticateUser,
    authorizeRole("Patient"),
    paymentController.verifyPayment
);

export default router;
