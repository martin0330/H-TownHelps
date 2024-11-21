// backend/history/sendHistory.js
const express = require('express');
const Histories = require('../../../schemas/history');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, historyItem } = req.body;

    if (
        !email ||
        !historyItem ||
        !historyItem.date ||
        !historyItem.description
    ) {
        return res.status(400).json({
            error: 'Invalid input. Please provide all required fields.',
        });
    }

    try {
        // Find the user's history document
        let userHistory = await Histories.findOne({ email });

        // If the user does not have a history document, create a new one
        if (!userHistory) {
            userHistory = new Histories({
                email,
                historyList: [historyItem], // Add the history item directly
            });
            await userHistory.save();
            return res.status(201).json({
                message: 'History created and added successfully',
            });
        }

        // Add the new history item to the historyList array
        userHistory.historyList.push(historyItem);

        // Save the updated document
        await userHistory.save();

        return res.status(200).json({
            message: 'History item added successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
