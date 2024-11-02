// backend/history/sendHistory.js
const express = require('express');
const Histories = require('../../../schemas/history');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, message } = req.body;
    try {
        // Find the user's notification document
        const userHistory = await Histories.findOne({ email });

        if (!userHistory) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add the new message to the History list array
        userHistory.historyList.push(message);

        // Save the updated document
        await userHistory.save();

        res.status(200).json({ message: 'History item added successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
