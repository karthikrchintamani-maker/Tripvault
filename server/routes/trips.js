const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Trip = require("../models/Trip");
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

function levenshteinDistance(s1, s2) {
    const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
    for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
    for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;
    for (let j = 1; j <= s2.length; j += 1) {
        for (let i = 1; i <= s1.length; i += 1) {
            const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator // substitution
            );
        }
    }
    return track[s2.length][s1.length];
}

const FAMOUS_DESTINATIONS = [
    "london", "paris", "tokyo", "new york", "berlin", "rome", "madrid", "delhi", "mumbai", 
    "bangalore", "bengaluru", "singapore", "sydney", "cairo", "toronto", "dubai", "moscow", 
    "beijing", "seoul", "bangkok", "amsterdam", "zurich", "geneva", "vienna", "brussels", 
    "barcelona", "switzerland", "france", "germany", "italy", "spain", "india", "japan", 
    "china", "canada", "australia", "united kingdom", "united states", "usa", "uk"
];

function fuzzyCorrect(input) {
    const cleaned = input.toLowerCase().trim();
    let bestMatch = input;
    let minDistance = 999;
    
    for (const dest of FAMOUS_DESTINATIONS) {
        const dist = levenshteinDistance(cleaned, dest);
        if (dist < minDistance && dist <= 2) { // Allow up to 2 typos
            minDistance = dist;
            bestMatch = dest;
        }
    }
    
    if (minDistance <= 2) {
        console.log(`Fuzzy matched spelling typo "${input}" -> corrected to: "${bestMatch}"`);
        return bestMatch;
    }
    return input;
}

// Helper function to geocode destination using Nominatim API (OpenStreetMap)
async function geocodeDestination(destination) {
    try {
        // Correct potential spelling mistakes like "londan" -> "london"
        const correctedDestination = fuzzyCorrect(destination);
        const query = encodeURIComponent(correctedDestination);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
        console.log(`Geocoding trip destination query URL: ${url}`);
        
        const response = await fetch(url, {
            headers: {
                "User-Agent": "TripVault-Travel-Journal/1.0"
            }
        });
        const data = await response.json();
        if (data && data.length > 0) {
            const latVal = parseFloat(data[0].lat);
            const lonVal = parseFloat(data[0].lon);
            
            // Extract country and city from display_name
            let country = "";
            let city = "";
            const displayNameParts = data[0].display_name.split(", ");
            if (displayNameParts.length > 0) {
                country = displayNameParts[displayNameParts.length - 1];
            }
            if (displayNameParts.length > 1) {
                // Find a sensible city name
                city = displayNameParts[0];
            }

            console.log(`Geocoding trip success: lat=${latVal}, lon=${lonVal}, country=${country}, city=${city}`);
            return {
                latitude: latVal,
                longitude: lonVal,
                country: country || undefined,
                city: city || undefined
            };
        }
    } catch (err) {
        console.error("Geocoding API error for trip, using default coordinates:", err.message);
    }
    // Fallback coordinates (India/Bengaluru)
    return { latitude: 12.9716, longitude: 77.5946, country: "India", city: "Bengaluru" };
}

/**
 * @openapi
 * /api/trips:
 *   post:
 *     summary: Create a new trip (Supports image uploads)
 *     tags: [Trips]
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
 *               - destination
 *             properties:
 *               title:
 *                 type: string
 *                 example: Summer in Paris
 *               destination:
 *                 type: string
 *                 example: Paris, France
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-10"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-20"
 *               description:
 *                 type: string
 *                 example: Eiffle Tower visit and croissants.
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       400:
 *         description: Missing fields or invalid rating
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", protect, upload.single("image"), async (req, res) => {
    try {
        const { title, destination, startDate, endDate, description, rating } = req.body;

        if (!title || !destination) {
            return res.status(400).json({ message: "Title and destination are required" });
        }

        let imagePath = "";
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        // Geocode destination
        const geo = await geocodeDestination(destination);

        const newTrip = new Trip({
            title,
            destination,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            description: description || "",
            rating: rating !== undefined ? Number(rating) : undefined,
            image: imagePath,
            latitude: geo.latitude,
            longitude: geo.longitude,
            country: geo.country,
            city: geo.city,
            user: req.user.id
        });

        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);
    } catch (error) {
        console.error("Create trip error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

/**
 * @openapi
 * /api/trips:
 *   get:
 *     summary: Get all trips for the logged-in user
 *     tags: [Trips]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of trips returned successfully
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
        const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        console.error("Get trips error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @openapi
 * /api/trips/{id}:
 *   get:
 *     summary: Get a single trip by ID
 *     tags: [Trips]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip details returned successfully
 *       404:
 *         description: Trip not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/:id", protect, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to view this trip" });
        }

        res.json(trip);
    } catch (error) {
        console.error("Get trip by ID error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @openapi
 * /api/trips/{id}:
 *   put:
 *     summary: Update an existing trip (Supports new image upload)
 *     tags: [Trips]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               destination:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       404:
 *         description: Trip not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, upload.single("image"), async (req, res) => {
    try {
        const { title, destination, startDate, endDate, description, rating } = req.body;
        let trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        let imagePath = trip.image;
        if (req.file) {
            if (trip.image) {
                const oldPath = path.join(__dirname, "..", trip.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            imagePath = `/uploads/${req.file.filename}`;
        }

        // If destination changed, re-geocode
        if (destination && destination !== trip.destination) {
            const geo = await geocodeDestination(destination);
            trip.latitude = geo.latitude;
            trip.longitude = geo.longitude;
            trip.country = geo.country;
            trip.city = geo.city;
            trip.destination = destination;
        }

        trip.title = title || trip.title;
        trip.startDate = startDate || trip.startDate;
        trip.endDate = endDate || trip.endDate;
        trip.description = description !== undefined ? description : trip.description;
        trip.rating = rating !== undefined ? Number(rating) : trip.rating;
        trip.image = imagePath;

        const updatedTrip = await trip.save();
        res.json(updatedTrip);
    } catch (error) {
        console.error("Update trip error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

/**
 * @openapi
 * /api/trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip removed successfully
 *       404:
 *         description: Trip not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        // Delete associated image file from storage
        if (trip.image) {
            const imageFilePath = path.join(__dirname, "..", trip.image);
            if (fs.existsSync(imageFilePath)) {
                fs.unlinkSync(imageFilePath);
            }
        }

        await trip.deleteOne();
        res.json({ message: "Trip removed successfully" });
    } catch (error) {
        console.error("Delete trip error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
