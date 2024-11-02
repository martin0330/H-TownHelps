// backend/history/getHistory.js
const express = require('express');
const Histories = require('../../../schemas/history');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email } = req.body;
    try {
        const userHist = await Histories.findOne({ email }); // Fetch the user's history document
        if (!userHist || !userHist.historyList.length) {
            return res.status(400).json({ error: 'No history for this user' });
        }
        return res.status(200).json(userNotif.historyList); // Send the history list as response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
