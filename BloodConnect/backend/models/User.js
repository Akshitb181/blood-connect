const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
    type: String,
    enum: ["donor", "receiver", "admin"],
    required: true
},

    bloodGroup: { type: String, default: "" },

location: { type: String, default: "" },

latitude: {
    type: Number,
    default: null
},

longitude: {
    type: Number,
    default: null
},

phone: { type: String, default: "" },

isAvailable: {
    type: Boolean,
    default: false
},

lastDonationDate: {
    type: Date,
    default: null
},

eligibleToDonate: {
    type: Boolean,
    default: true
},

bloodComponents: {
    type: [String],
    default: ["Whole Blood"]
},

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);