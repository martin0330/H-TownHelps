// backend/register.js
const express = require('express');
const userProfile = require('../../schemas/userProfile');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { firstName, lastName, email, password, gender } = req.body;

    try {
        let existingUser = await userProfile.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const adminAccess = false;

        // Correct way to generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserProfile = new userProfile({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            gender,
            adminAccess,
            skills: [],
            availability: [],
            profileComplete: false,
        });

        await newUserProfile.save();

        return res.status(201).json({
            message:
                'User registered successfully. Please complete your profile to be eligible for event selection.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
