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

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        if (hashedPassword !== existingUser.password) {
            return res.status(400).json({ error: 'Incorrect password' });
        }
        return res.status(201).json({ message: 'User logged in successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
