// backend/events/deleteEvents.js
const express = require('express');
const Events = require('../../../schemas/events');
const router = express.Router();

router.delete('/', async (req, res) => {
    const { eventId } = req.body;
    try {
        const deletedEvent = await Events.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
