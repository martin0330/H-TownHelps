// backend/profile/autofillProfile.js
const express = require('express');
const profileInfo = require('../../../schemas/profileInfo');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await profileInfo.findOne({ email: email });
        if (!existingUser) {
            return res
                .status(400)
                .json({ error: 'User did not create a profile yet' });
        }
        return res.status(201).json(existingUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
