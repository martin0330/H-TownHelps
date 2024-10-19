// backend/profile/addProfile.js
const express = require('express');
const ProfileInfo = require('../../../schemas/profileInfo');
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

    try {
        let user = await ProfileInfo.findOne({ email: email });
        if (user) {
            // Update existing user
            await ProfileInfo.updateOne(
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
                    profileComplete: true,
                }
            );
        } else {
            // Create new user
            user = new ProfileInfo({
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
                profileComplete: true,
            });
            await user.save();
        }

        return res.status(201).json({ 
            message: user ? 'User profile updated successfully' : 'User profile created successfully',
            info: 'Profile completed. You may be selected for events based on your availability.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;