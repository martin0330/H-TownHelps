require('dotenv').config({ path: '../../.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const register = require('./api/register.js');
const signin = require('./api/signin.js');
const profile = require('./api/profile.js');
const autofillProfile = require('./api/autofillProfile.js')

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(
        process.env.REACT_APP_ATLAS_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/register', register);
app.use('/api/signin', signin);
app.use('/api/profile', profile);
app.use('/api/autofillProfile', autofillProfile);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
