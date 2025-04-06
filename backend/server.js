require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Import DB connection function

// Connect Database
connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [];
console.log("Allowed CORS Origins:", allowedOrigins); // Log for debugging

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or if the origin is in our allowed list.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`); // Log blocked origins
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Important for potential future auth
};

// Init Middleware
app.use(cors(corsOptions)); // Use configured CORS options
app.use(express.json()); // Enable parsing JSON request bodies

// Define Routes
app.get("/", (req, res) => res.send("API Running"));
app.use("/api/jobs", require("./routes/jobs")); // Corrected path
app.use("/api/developers", require("./routes/developers")); // Corrected path
app.use("/api/skills", require("./routes/skill.routes")); // Keep this one as is

// Global Error Handler (Add this AFTER all routes and other middleware)
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack);
    // Check if the response headers have already been sent
    if (res.headersSent) {
        return next(err);
    }
    // Send a generic JSON error response
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error",
        // Optionally include stack in development
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});

const PORT = process.env.PORT || 5001; // Use port from env or default

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
