const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Memory = require("../models/Memory");
const { protect } = require("../middleware/authMiddleware");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|gif/i;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Only images (jpg, jpeg, png, webp, gif) are allowed!"));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Helper function to geocode city and country using Nominatim API (OpenStreetMap)
async function geocode(city, country) {
    try {
        const query = encodeURIComponent(`${city}, ${country}`);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
        console.log(`Geocoding query URL: ${url}`);
        
        const response = await fetch(url, {
            headers: {
                "User-Agent": "TripVault-Travel-Journal/1.0"
            }
        });
        const data = await response.json();
        if (data && data.length > 0) {
            const latVal = parseFloat(data[0].lat);
            const lonVal = parseFloat(data[0].lon);
            console.log(`Geocoding success: lat=${latVal}, lon=${lonVal}`);
            return {
                latitude: latVal,
                longitude: lonVal
            };
        }
    } catch (err) {
        console.error("Geocoding API error, using default coordinates:", err.message);
    }
    // Fallback coordinates (India/Bengaluru)
    return { latitude: 12.9716, longitude: 77.5946 };
}

/**
 * @openapi
 * /api/memory:
 *   post:
 *     summary: Create a new travel memory (Requires file upload)
 *     tags: [Memories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *               - date
 *               - country
 *               - city
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: Exploring Tokyo
 *               description:
 *                 type: string
 *                 example: Visited Sensoji temple and ate ramen.
 *               location:
 *                 type: string
 *                 example: Asakusa, Tokyo, Japan
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-01"
 *               country:
 *                 type: string
 *                 example: Japan
 *               city:
 *                 type: string
 *                 example: Tokyo
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-05"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Memory created successfully (coordinates automatically geocoded)
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", protect, upload.single("image"), async (req, res) => {
    try {
        console.log("POST /api/memory - received request body:", req.body);
        console.log("POST /api/memory - received file details:", req.file);
        
        const { title, description, location, date, country, city, startDate, endDate } = req.body;

        if (!title || !description || !location || !date) {
            console.log("Validation failed: missing fields");
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        // File path for image
        let imagePath = "";
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        // Geocode coordinates automatically
        const coords = await geocode(city || "Bengaluru", country || "India");

        const newMemory = new Memory({
            title,
            description,
            location,
            date,
            image: imagePath,
            country: country || undefined,
            city: city || undefined,
            latitude: coords.latitude,
            longitude: coords.longitude,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            user: req.user.id
        });

        const savedMemory = await newMemory.save();
        console.log("Memory saved successfully with coordinates:", savedMemory._id, savedMemory.latitude, savedMemory.longitude);
        res.status(201).json(savedMemory);
    } catch (error) {
        console.error("Create memory error details:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

/**
 * @openapi
 * /api/memory:
 *   get:
 *     summary: Retrieve all memories for the logged-in user
 *     tags: [Memories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of memories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", protect, async (req, res) => {
    try {
        const memories = await Memory.find({ user: req.user.id }).sort({ date: -1 });
        res.json(memories);
    } catch (error) {
        console.error("Get memories error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @openapi
 * /api/memory/{id}:
 *   put:
 *     summary: Update an existing travel memory
 *     tags: [Memories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Memory document ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Memory updated successfully
 *       404:
 *         description: Memory not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, upload.single("image"), async (req, res) => {
    try {
        const { title, description, location, date, country, city, startDate, endDate } = req.body;
        let memory = await Memory.findById(req.id || req.params.id);

        if (!memory) {
            return res.status(404).json({ message: "Memory not found" });
        }

        // Check if user owns the memory
        if (memory.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        // If a new file is uploaded, remove the old file if it exists
        let imagePath = memory.image;
        if (req.file) {
            if (memory.image) {
                const oldPath = path.join(__dirname, "..", memory.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            imagePath = `/uploads/${req.file.filename}`;
        }

        memory.title = title || memory.title;
        memory.description = description || memory.description;
        memory.location = location || memory.location;
        memory.date = date || memory.date;
        memory.image = imagePath;
        memory.startDate = startDate || memory.startDate;
        memory.endDate = endDate || memory.endDate;

        // If city or country has changed, re-geocode coordinates
        if (country || city) {
            const newCity = city || memory.city;
            const newCountry = country || memory.country;
            const coords = await geocode(newCity, newCountry);
            memory.latitude = coords.latitude;
            memory.longitude = coords.longitude;
            memory.city = newCity;
            memory.country = newCountry;
        }

        const updatedMemory = await memory.save();
        res.json(updatedMemory);
    } catch (error) {
        console.error("Update memory error:", error.message);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

/**
 * @openapi
 * /api/memory/{id}:
 *   delete:
 *     summary: Delete a travel memory
 *     tags: [Memories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Memory document ID
 *     responses:
 *       200:
 *         description: Memory removed successfully
 *       404:
 *         description: Memory not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);

        if (!memory) {
            return res.status(404).json({ message: "Memory not found" });
        }

        // Check if user owns the memory
        if (memory.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        // Delete associated image file from local storage
        if (memory.image) {
            const imageFilePath = path.join(__dirname, "..", memory.image);
            if (fs.existsSync(imageFilePath)) {
                fs.unlinkSync(imageFilePath);
            }
        }

        await memory.deleteOne();
        res.json({ message: "Memory removed successfully" });
    } catch (error) {
        console.error("Delete memory error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
