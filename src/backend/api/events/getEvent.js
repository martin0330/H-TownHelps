const express = require('express');
const router = express.Router();
const Events = require('../../../schemas/events');

router.post('/', async (req, res) => {
    const { id } = req.body;
    try {
        const event = await Events.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
