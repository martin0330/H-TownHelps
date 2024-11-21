// backend/events/addEvents.js
const express = require('express');
const Events = require('../../../schemas/events');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // Destructure the event data from the request body
        const { name, description, location, skills, date } = req.body;

        // Create a new event object based on the schema
        const newEvent = new Events({
            name, // Event name
            description, // Event description
            location, // Event location
            date: new Date(date), // Event date
            skills, // Required skills (array of strings)
            people: [], // Initialize an empty array for 'people'
        });

        // Save the event to the database
        await newEvent.save();

        // Return the created event data in the response
        return res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
