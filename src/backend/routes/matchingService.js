const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); // Adjust the path as needed

router.post('/volunteer-matching', async (req, res) => {
  try {
    const { skills, availability } = req.body;

    // Find events that match the user's skills or availability
    const matches = await Event.find({
      $or: [
        { requiredSkills: { $in: skills } },
        { dateTime: { $in: availability } }
      ]
    }).limit(10); // Limit to 10 matches for now

    res.json(matches);
  } catch (error) {
    console.error('Error in volunteer matching:', error);
    res.status(500).json({ error: 'An error occurred while finding matches' });
  }
});

module.exports = router;

