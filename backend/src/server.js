const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const {
    redirectToOriginalUrl
} = require("./controllers/urlController");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


// Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.json());

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

app.use(cookieParser());

// Routes
app.use("/api/urls", urlRoutes);
app.use("/api/auth", authRoutes);

// Home
app.get("/", (req, res) => {
    res.send("URL Shortener API is running!");
});

app.get("/:shortCode", redirectToOriginalUrl);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});