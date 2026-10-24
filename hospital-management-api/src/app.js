import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import qualificationRoutes from "./routes/qualification.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import receptionistRoutes from "./routes/receptionist.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import diseaseRoutes from "./routes/disease.routes.js";
import specialistRoutes from "./routes/specialist.routes.js";
import slotsRoutes from "./routes/slots.routes.js";
import weekSlotsRoutes from "./routes/weekslots.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
import treatmentRoutes from "./routes/treatment.routes.js";
import messageRoutes from "./routes/message.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

// security middleware
app.use(helmet());

// allow frontend request
app.use(cors());

// parse incoming JSON request bodies
app.use(express.json());

// Swagger UI
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// Raw OpenAPI specification
app.get("/api-docs.json", (req, res) => {
    res.json(swaggerSpec);
});

// parse URL encoded form data
app.use(express.urlencoded({ extended: true }));


// health check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hospital management API is running",
    });
});

// Register API routes here
app.use("/api/auth", authRoutes);
app.use("/api/admin/qualification", qualificationRoutes);
app.use("/api/admin/doctor", doctorRoutes);
app.use("/api/admin/receptionists", receptionistRoutes);
app.use("/api/receptionist/patients", patientRoutes);
app.use("/api/receptionist/disease", diseaseRoutes);
app.use("/api/receptionist/specialist", specialistRoutes);
app.use("/api/receptionist/slots", slotsRoutes);
app.use("/api/receptionist/weekslots", weekSlotsRoutes);
app.use("/api/doctor/availability", availabilityRoutes);
app.use("/api/patient/treatment", treatmentRoutes);
app.use("/api/user/message", messageRoutes);
app.use("/api/patient/payments", paymentRoutes);

// handle Unknow Routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Routes not found: ${req.method} ${req.originalurl}`,
    });
});

// central Error handler

app.use((err, req, res, next) => {
    if (err.statusCode >= 500) {
        console.error(err);
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error",
    });
});


export default app;