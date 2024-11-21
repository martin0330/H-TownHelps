// backend/events/updateEvent.js
const express = require('express');
const router = express.Router();
const Events = require('../../../schemas/events');

// Update event by ID
router.post('/', async (req, res) => {
    const { id, updatedEvent } = req.body;

    console.log(updatedEvent);

    try {
        // Find the event by its ID and update it with the new data
        const event = await Events.findByIdAndUpdate(id, updatedEvent, {
            new: true,
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        return res.json({ message: 'Event updated successfully', event });
    } catch (error) {
        console.error('Error updating event:', error);
        return res.status(500).json({ error: 'Failed to update event' });
    }
});

module.exports = router;
