const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
},

    bloodGroup: { type: String, required: true },

bloodComponent: {
    type: String,
    enum: [
        "Whole Blood",
        "Red Blood Cells",
        "Platelets",
        "Plasma"
    ],
    default: "Whole Blood"
},

units: { type: Number, required: true, min: 1 },

location: { type: String, required: true },

    hospital: {
        type: String,
        required: true
    },

    emergency: {
        type: Boolean,
        default: false
    },

    message: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["pending", "accepted", "completed", "cancelled"],
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);