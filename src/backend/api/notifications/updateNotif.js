// backend/notifications/updateNotif.js
const express = require('express');
const Notifications = require('../../../schemas/notifications');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, notificationList } = req.body;
    try {
        const userNotif = await Notifications.findOne({ email }); // Fetch the user's notification document

        // Update the document
        userNotif.notificationList = notificationList;
        userNotif.save();

        return res.status(200).json({ message: 'Notification updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
