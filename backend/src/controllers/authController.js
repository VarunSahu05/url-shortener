const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required"
            });
        }

        // Verify Google ID token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const {
            sub,
            name,
            email,
            picture
        } = payload;

        // Find existing user
        let user = await User.findOne({
            googleId: sub
        });

        // Create user if first login
        if (!user) {
            user = await User.create({
                googleId: sub,
                name,
                email,
                picture
            });
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Google login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        });

    } catch (error) {
        console.error("Google authentication error:", error);

        res.status(401).json({
            message: "Invalid Google credential"
        });
    }
};

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.status(200).json({
        message: "Logout successful"
    });
};

const getMe = async (req, res) => {
    const user = await User.findById(req.user.userId).select(
        "-googleId"
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
    });
};

module.exports = {
    googleLogin,
    logout,
    getMe
};