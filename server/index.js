const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Dynamic CORS configuration to handle both local dev and production safely
const allowedOrigins = [
    "https://vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin) return callback(null, true);
        
        const isVercel = /\.vercel\.app$/.test(origin);
        if (allowedOrigins.indexOf(origin) !== -1 || origin === process.env.FRONTEND_URL || isVercel) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check — used by Render to verify the service is alive
app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "TripVault API is running" });
});

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
app.use("/api/trips", require("./routes/trips"));
app.use("/api/users", require("./routes/users"));

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
            memories: ["/api/memory"],
            trips: ["/api/trips"]
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
