// backend/profile.js
const express = require('express');
const mongoose = require('mongoose');
const profileInfo = require('../../schemas/profileInfo'); // Adjust the path as needed
const router = express.Router();

router.post('/', async (req, res) => {
    const {
        email,
        fullName,
        address1,
        address2,
        city,
        state,
        zipCode,
        skills,
        preferences,
        availability,
    } = req.body;
    console.log(req.body);

    try {
        let existingUser = await profileInfo.findOne({ email: email });
        if (existingUser) {
            const result = await profileInfo.updateOne(
                { email },
                {
                    fullName,
                    address1,
                    address2,
                    city,
                    state,
                    zipCode,
                    skills,
                    preferences,
                    availability,
                }
            );
            return res
                .status(201)
                .json({ message: 'User profile updated successfully' });
        } else {
            const newProfileInfo = new profileInfo({
                _id: new mongoose.Types.ObjectId(),
                email,
                fullName,
                address1,
                address2,
                city,
                state,
                zipCode,
                skills,
                preferences,
                availability,
            });
            await newProfileInfo.save();
            return res
                .status(201)
                .json({ message: 'User profile created successfully' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
