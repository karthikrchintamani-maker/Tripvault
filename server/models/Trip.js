const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Title is required"] 
    },
    destination: { 
        type: String, 
        required: [true, "Destination is required"] 
    },
    startDate: { 
        type: Date 
    },
    endDate: { 
        type: Date 
    },
    description: { 
        type: String 
    },
    rating: { 
        type: Number, 
        min: [1, "Rating must be at least 1"], 
        max: [5, "Rating cannot be more than 5"] 
    },
    image: {
        type: String
    },
    coverImage: {
        type: String
    },
    photos: {
        type: [String],
        default: []
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Trip", tripSchema);
