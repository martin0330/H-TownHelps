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
    },
    { timestamps: true }
);

const userProfile = mongoose.model('UserProfile', userProfileSchema); // 'UserProfile' will be the collection name

module.exports = userProfile;
