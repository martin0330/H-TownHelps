// backend/register.js
const express = require('express');
const mongoose = require('mongoose');
const userProfile = require('../../schemas/userProfile'); // Adjust the path as needed
const router = express.Router();

// User Registration Route
router.post('/', async (req, res) => {
    const { firstName, lastName, email, password, gender } = req.body;
    console.log(req.body);

    try {
        let existingUser = await userProfile.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUserProfile = new userProfile({
            _id: new mongoose.Types.ObjectId(),
            firstName,
            lastName,
            email,
            password,
            gender,
        });

        await newUserProfile.save();
        return res
            .status(201)
            .json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
