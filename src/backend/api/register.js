const express = require('express');
const mongoose = require('mongoose');
const userProfile = require('../../schemas/userProfile');
const router = express.Router();

router.post('/', async (req, res) => {
    const { firstName, lastName, email, password, gender } = req.body;
    console.log(req.body);

    try {
        let existingUser = await userProfile.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const adminAccess = false;

        const newUserProfile = new userProfile({
            firstName,
            lastName,
            email,
            password, 
            gender,
            adminAccess,
            skills: [],
            availability: [],
            profileComplete: false
        });

        await newUserProfile.save();

        return res
            .status(201)
            .json({ message: 'User registered successfully. Please complete your profile to be eligible for event selection.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
