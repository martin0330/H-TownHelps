// api/adminMatching.js
const express = require('express');
const ProfileInfo = require('../schemas/profileInfo');
const Event = require('../schemas/events');
const router = express.Router();

// Middleware to check admin access
const checkAdminAccess = async (req, res, next) => {
    const { email } = req.body; // Assuming the admin's email is sent in the request body
    try {
        const user = await ProfileInfo.findOne({ email });
        if (!user || !user.adminAccess) {
            return res.status(403).json({ error: 'Unauthorized: Admin access required' });
        }
        next();
    } catch (error) {
        console.error('Error checking admin access:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Apply the admin check middleware to all routes in this file
router.use(checkAdminAccess);

// Route to get available users for a specific event date
router.get('/available-users/:eventId', async (req, res) => {
    const { eventId } = req.params;

    if (!eventId) {
        return res.status(400).json({ error: 'Event ID is required' });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const availableUsers = await ProfileInfo.find({
            availability: { $elemMatch: { $eq: event.date } },
            profileComplete: true
        }).select('fullName email');

        res.status(200).json({ 
            message: 'Available users retrieved successfully',
            eventName: event.name,
            eventDate: event.date,
            availableUsers: availableUsers
        });

    } catch (error) {
        console.error('Error in getting available users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to assign users to an event
router.post('/assign-users/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const { userIds } = req.body;

    if (!eventId || !userIds || !Array.isArray(userIds)) {
        return res.status(400).json({ error: 'Event ID and array of user IDs are required' });
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { $addToSet: { assignedUsers: { $each: userIds } } },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await ProfileInfo.updateMany(
            { _id: { $in: userIds } },
            { $addToSet: { assignedEvents: eventId } }
        );

        res.status(200).json({
            message: 'Users assigned to event successfully',
            event: updatedEvent
        });

    } catch (error) {
        console.error('Error in assigning users to event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;