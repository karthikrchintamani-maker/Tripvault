const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger Configuration
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "TripVault API Documentations",
            version: "1.0.0",
            description: "TripVault Travel Memory Journal REST API Documentation and Test Suite",
            contact: {
                name: "TripVault Support"
            }
        },
        servers: [
            {
                url: "http://127.0.0.1:5000"
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: [path.join(__dirname, "routes", "*.js").replace(/\\/g, "/")]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mount Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/memory", require("./routes/memory"));

// Test root route
app.get("/", (req, res) => {
    res.send("TripVault Backend running successfully");
});

// Welcome API route
app.get("/api", (req, res) => {
    res.json({
        message: "Welcome to the TripVault API",
        endpoints: {
            auth: ["/api/auth/register", "/api/auth/login", "/api/auth/me"],
            memories: ["/api/memory"]
        }
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Express Error Handler caught error:", err.message);
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
        message: err.message || "An unexpected server error occurred"
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Running on port ${PORT}`);
});