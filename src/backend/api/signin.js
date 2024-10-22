// backend/signin.js
const express = require('express');
const userProfile = require('../../schemas/userProfile');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        let existingUser = await userProfile.findOne({ email: email });
        if (!existingUser) {
            return res
                .status(400)
                .json({ error: 'This email is not registered' });
        }

        // Corrected logic for password comparison
        const passwordCompare = await bcrypt.compare(
            password,
            existingUser.password
        );

        // If the password doesn't match
        if (!passwordCompare) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // If the password matches
        return res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
