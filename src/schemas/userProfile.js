// schemas/userProfile.js
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        gender: { type: String, required: true },
        adminAccess: { type: Boolean, required: true },
        // New fields for volunteer matching
        skills: { type: [String], default: [] },
        availability: { type: [Date], default: [] },
        matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
        // Field to store the status of the user's profile completion
        profileComplete: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const userProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = userProfile;
