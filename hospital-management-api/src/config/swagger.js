
import swaggerJsdoc from "swagger-jsdoc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const srcDirectory = path.resolve(currentDirectory, "..");

const swaggerOptions = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Hospital Management API",
            version: "1.0.0",
            description: "REST API documentation for the Hospital Management System.",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [
        `${srcDirectory.replace(/\\/g, "/")}/routes/*.js`,
        `${srcDirectory.replace(/\\/g, "/")}/docs/*.js`,
    ],
    failOnErrors: true,
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

console.log("Swagger patterns:", swaggerOptions.apis);
console.log("Swagger discovered paths:", Object.keys(swaggerSpec.paths || {}));

export default swaggerSpec;
