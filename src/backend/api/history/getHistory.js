// backend/history/getHistory.js
const express = require('express');
const Histories = require('../../../schemas/history');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email } = req.body;
    try {
        if (Array.isArray(email)) {
            let histories = [];
            for (const profile of email) {
                const personEmail = profile.email;
                const userHist = await Histories.findOne({
                    email: personEmail,
                });
                if (!userHist || !userHist.historyList.length) {
                    continue;
                }
                histories.push({
                    email: personEmail,
                    histories: userHist.historyList,
                });
            }
            return res.status(200).json(histories); // Return email + histories for all users
        }

        const userHist = await Histories.findOne({ email }); // Fetch the user's history document
        if (!userHist || !userHist.historyList.length) {
            return res.status(400).json({ error: 'No history for this user' });
        }

        return res.status(200).json({
            email,
            histories: userHist.historyList, // Include email and their histories in response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
