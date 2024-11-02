require('dotenv').config({ path: '../../.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Apis
const register = require('./api/register.js');
const signin = require('./api/signin.js');
const profile = require('./api/profile/addProfile.js');
const getProfiles = require('./api/profile/getProfiles.js');
const adminAccess = require('./api/profile/adminAccess.js');
const autofillProfile = require('./api/profile/autofillProfile.js');
const getEvents = require('./api/events/getEvents.js');
const getEvent = require('./api/events/getEvent.js');
const addEvent = require('./api/events/addEvent.js');
const deleteEvent = require('./api/events/deleteEvent.js');
const updateEvent = require('./api/events/updateEvent.js');
const getNotifs = require('./api/notifications/getNotif.js');
const sendNotif = require('./api/notifications/sendNotif.js');
const updateNotif = require('./api/notifications/updateNotif.js');
const getHistory = require('./api/history/getHistory.js');
const sendHistory = require('./api/history/sendHistory.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.REACT_APP_ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/register', register);
app.use('/api/signin', signin);
app.use('/api/profile', profile);
app.use('/api/getProfiles', getProfiles);
app.use('/api/adminAccess', adminAccess);
app.use('/api/autofillProfile', autofillProfile);
app.use('/api/getEvents', getEvents);
app.use('/api/getEvent', getEvent);
app.use('/api/addEvent', addEvent);
app.use('/api/deleteEvent', deleteEvent);
app.use('/api/updateEvent', updateEvent);
app.use('/api/getNotifications', getNotifs);
app.use('/api/sendNotification', sendNotif);
app.use('/api/updateNotifications', updateNotif);
app.use('/api/getHistory', getHistory);
app.use('/api/sendHistory', sendHistory);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
