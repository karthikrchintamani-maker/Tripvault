const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "tripvault",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
            return `image-${uniqueSuffix}`;
        }
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
