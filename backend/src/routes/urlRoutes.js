const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    createShortUrl,
    getAllUrls,
    deleteUrl,
    deleteAllUrls
} = require("../controllers/urlController");

const protect = require("../middleware/authMiddleware");

const createUrlLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        message: "Too many URL creation requests. Please try again later."
    }
});

const router = express.Router();

router.post("/", protect, createUrlLimiter, createShortUrl); //--> Rate Limiting

router.get("/", protect, getAllUrls);

router.delete("/:id", protect, deleteUrl);

router.delete("/", protect, deleteAllUrls);

module.exports = router;