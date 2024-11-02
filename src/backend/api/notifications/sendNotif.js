// backend/notifications/sendNotif.js
const express = require('express');
const userProfile = require('../../../schemas/userProfile');
const Notifications = require('../../../schemas/notifications');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, message } = req.body;
    try {

        // Check if user is registered
        const User = await userProfile.findOne({ email });
        if(!User) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the user's notification document
        const userNotification = await Notifications.findOne({ email });

        if (userNotification) {
            // Add the new message to the notificationList array
            userNotification.notificationList.push(message);

            // Save the updated document
            await userNotification.save();

            return res.status(200).json({ message: 'Notification added successfully' });
        }

        // If there are no notifications for the user, create a new document for them
        const newUserNotification = new Notifications({
            email,
            notificationList: [message],
        });
        
        // Save the Schema
        newUserNotification.save();
        
        return res.status(200).json({ message: 'Notification created and added successfully' });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;