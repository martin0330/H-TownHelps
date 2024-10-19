// backend/events/getEvents.js
const express = require('express');
const Events = require('../../../schemas/events');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const eventsList = await Events.find({}); // Fetch all events
        if (!eventsList.length) {
            return res
                .status(400)
                .json({ error: 'No events have been created yet' });
        }
        return res.status(200).json(eventsList); // Send the events as response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
