const { nanoid } = require("nanoid");
const Url = require("../models/Url");

const createShortUrl = async (req, res) => {
    try {
        const { originalUrl, expiresAt } = req.body;

        // Check URL exists
        if (!originalUrl) {
            return res.status(400).json({
                message: "Original URL is required"
            });
        }

        // Validate URL
        let parsedUrl;

        try {
            parsedUrl = new URL(originalUrl);
        } catch {
            return res.status(400).json({
                message: "Invalid URL"
            });
        }

        // Only allow HTTP and HTTPS
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({
                message: "Only HTTP and HTTPS URLs are allowed"
            });
        }

        // Validate expiration
        if (expiresAt) {
            const expirationDate = new Date(expiresAt);

            if (isNaN(expirationDate.getTime())) {
                return res.status(400).json({
                    message: "Invalid expiration date"
                });
            }

            if (expirationDate <= new Date()) {
                return res.status(400).json({
                    message: "Expiration date must be in the future"
                });
            }
        }

        // Generate short code
        const shortCode = nanoid(6);

        // Save URL
        const newUrl = await Url.create({
            originalUrl,
            shortCode,
            expiresAt: expiresAt || null,
            user: req.user.userId
        });

        res.status(201).json({
            originalUrl: newUrl.originalUrl,
            shortCode: newUrl.shortCode,
            shortUrl: `${req.protocol}://${req.get("host")}/${newUrl.shortCode}`,
            expiresAt: newUrl.expiresAt
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({
                message: "Short URL not found"
            });
        }

        // Check expiration
        if (url.expiresAt && url.expiresAt < new Date()) {
            return res.status(410).json({
                message: "Short URL has expired"
            });
        }

        // Increment clicks
        await Url.findByIdAndUpdate(url._id, {
            $inc: { clicks: 1 },
            $set: { lastClickedAt: new Date() }
        });

        // Redirect
        res.redirect(url.originalUrl);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAllUrls = async (req, res) => {
    try {
        const urls = await Url.find({
            user: req.user.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json(urls);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteUrl = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUrl = await Url.findOneAndDelete({
            _id: id,
            user: req.user.userId
        });

        if (!deletedUrl) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        res.status(200).json({
            message: "URL deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteAllUrls = async (req, res) => {
    try {
        const result = await Url.deleteMany({
            user: req.user.userId
        });

        res.status(200).json({
            message: "History cleared successfully",
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createShortUrl,
    redirectToOriginalUrl,
    getAllUrls,
    deleteUrl,
    deleteAllUrls
};