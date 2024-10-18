// backend/adminAccess.js
const express = require('express');
const mongoose = require('mongoose');
const userProfile = require('../../../schemas/userProfile');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        const User = await userProfile.findOne({ email });
        const adminAccess = User.adminAccess;
        return res.status(201).json({ access: adminAccess });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
