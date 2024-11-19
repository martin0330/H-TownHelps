// backend/history/sendHistory.js
const express = require('express');
const Histories = require('../../../schemas/history');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, message } = req.body;
    try {
        // Find the user's notification document
        const userHistory = await Histories.findOne({ email });

        // Create history is user history is not found
        if (!userHistory) {
            const newUserHistory = new Histories({
                email,
                notificationList: [message],
            });
            newUserHistory.save();
            return res.status(200).json({
                message: 'History created and added successfully',
            });
        }

        // Add the new message to the History list array
        userHistory.historyList.push(message);

        // Save the updated document
        await userHistory.save();

        return res
            .status(200)
            .json({ message: 'History item added successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
