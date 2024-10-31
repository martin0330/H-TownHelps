const express = require('express');
const Notifications = require('../../../schemas/notifications');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, message } = req.body;
    try {
        // Find the user's notification document
        const userNotification = await Notifications.findOne({ email });

        if (!userNotification) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add the new message to the notificationList array
        userNotification.notificationList.push(message);

        // Save the updated document
        await userNotification.save();

        res.status(200).json({ message: 'Notification added successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;