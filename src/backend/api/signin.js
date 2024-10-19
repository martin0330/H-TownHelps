// backend/signin.js
const express = require('express');
const userProfile = require('../../schemas/userProfile');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        let existingUser = await userProfile.findOne({ email: email });
        if (!existingUser) {
            return res
                .status(400)
                .json({ error: 'This email is not registered' });
        }

        if (password !== existingUser.password) {
            return res.status(400).json({ error: 'Incorrect password' });
        }
        return res.status(201).json({ message: 'User logged in successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
