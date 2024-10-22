// schemas/notifications.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        notificationList: { type: [String], default: [] },
        matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notifications' }],
    },
    { timestamps: true }
);

const notificationProfile = mongoose.model('UserNotifications', notificationSchema);

module.exports = notificationProfile;
