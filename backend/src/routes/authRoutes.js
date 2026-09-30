const express = require("express");

const {
    googleLogin,
    logout,
    getMe
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/google", googleLogin);

router.post("/logout", logout);

router.get("/me", protect, getMe);

module.exports = router;