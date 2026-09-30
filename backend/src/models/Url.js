const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true
        },

        shortCode: {
            type: String,
            required: true,
            unique: true
        },

        clicks: {
            type: Number,
            default: 0
        },

        lastClickedAt: {
            type: Date,
            default: null
        },

        expiresAt: {
            type: Date,
            default: null
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Url", urlSchema);