const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Trip = require("../models/Trip");
const { protect } = require("../middleware/authMiddleware");
const cloudinaryUpload = require("../middleware/upload");

/**
 * @openapi
 * /api/users/{username}/profile:
 *   get:
 *     summary: Get public user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *     responses:
 *       200:
 *         description: Public profile data and trips
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 username:
 *                   type: string
 *                 trips:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/:username/profile", async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();
        const user = await User.findOne({ username }).select("name bio username");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const trips = await Trip.find({ user: user._id })
            .select("title destination startDate endDate rating coverImage")
            .sort({ createdAt: -1 });

        res.json({
            name: user.name,
            bio: user.bio,
            username: user.username,
            trips
        });
    } catch (error) {
        console.error("Get public profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @openapi
 * /api/users/profile:
 *   put:
 *     summary: Update logged-in user's bio or username
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe123
 *               bio:
 *                 type: string
 *                 example: Travel enthusiast and writer.
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Username already taken or invalid inputs
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/profile", protect, async (req, res) => {
    try {
        const { username, bio } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (username !== undefined) {
            const cleanUsername = username.toLowerCase().trim();
            if (!cleanUsername) {
                return res.status(400).json({ message: "Username cannot be empty" });
            }
            if (cleanUsername !== user.username) {
                const usernameExists = await User.findOne({ username: cleanUsername });
                if (usernameExists) {
                    return res.status(400).json({ message: "Username is already taken" });
                }
                user.username = cleanUsername;
            }
        }

        if (bio !== undefined) {
            user.bio = bio;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

/**
 * PUT /api/users/profile/avatar
 * Upload or update the logged-in user's profile avatar via Cloudinary
 */
router.put("/profile/avatar", protect, cloudinaryUpload.single("avatar"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.avatar = req.file.path; // Cloudinary URL
        await user.save();

        res.json({ avatar: user.avatar });
    } catch (error) {
        console.error("Avatar upload error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

module.exports = router;
