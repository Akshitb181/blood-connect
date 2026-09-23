const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    bloodRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BloodRequest",
        required: true
    },

    bloodGroup: {
        type: String,
        required: true
    },

    units: {
        type: Number,
        required: true,
        min: 1
    },

    hospital: {
        type: String,
        required: true
    },

    donationDate: {
        type: Date,
        default: Date.now
    },

    // Certificate verification
    verificationStatus: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending"
    },

    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    verifiedAt: {
        type: Date,
        default: null
    },

    certificateId: {
        type: String,
        unique: true,
        sparse: true
    }

});

module.exports = mongoose.model("Donation", donationSchema);