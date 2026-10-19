import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import qualificationRoutes from "./routes/qualification.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import receptionistRoutes from "./routes/receptionist.routes.js";

const app = express();

// security middleware
app.use(helmet());

// allow frontend request
app.use(cors());

// parse incoming JSON request bodies
app.use(express.json());

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
app.use("/api/admin/qualification", qualificationRoutes);
app.use("/api/admin/doctor", doctorRoutes);
app.use("/api/admin/receptionists", receptionistRoutes);

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