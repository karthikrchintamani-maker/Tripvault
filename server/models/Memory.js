const mongoose = require("mongoose");

const MemorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    },
    date: {
        type: Date,
        required: [true, "Date is required"]
    },
    image: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        required: [true, "Country is required"],
        default: "India",
        trim: true
    },
    city: {
        type: String,
        required: [true, "City is required"],
        default: "Bengaluru",
        trim: true
    },
    latitude: {
        type: Number,
        default: 12.9716
    },
    longitude: {
        type: Number,
        default: 77.5946
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        default: Date.now
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Memory", MemorySchema);
