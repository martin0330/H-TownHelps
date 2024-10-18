// schemas/profileInfo.js
const mongoose = require('mongoose');

const profileInfoSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        fullName: { type: String, required: true, maxlength: 50 },
        address1: { type: String, required: true, maxlength: 100 },
        address2: { type: String, maxlength: 100 },
        city: { type: String, required: true, maxlength: 100 },
        state: {
            type: String,
            required: true,
            enum: [
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
            ],
        },
        zipCode: { type: String, required: true, minlength: 5, maxlength: 9 },
        skills: [
            {
                type: String,
                enum: [
                    'Academics', 'Administrative & Clerical', 'Animals & Environment',
                    'Arts', 'Business & Management', 'Children & Family',
                    'Computers & IT', 'Disaster Relief', 'Education & Literacy',
                    'Engineering', 'Finance', 'Food Service & Events',
                    'For Profit & Nonprofit Development', 'HR',
                    'Healthcare & Social Services', 'Hobbies & Crafts',
                    'Housing & Facilities', 'IT Infrastructure & Software',
                    'Interactive & Web Development', 'Interpersonal',
                    'Language & Culture', 'Legal & Advocacy',
                    'Logistics, Supply Chain & Transportation',
                    'Marketing & Communications', 'Music', 'Performing Arts',
                    'Sports & Recreation', 'Strategy Development & Business Planning',
                    'Trades'
                ],
            },
        ],
        preferences: { type: String },
        availability: [{ type: Date }],
        profileComplete: { type: Boolean, default: false },
        matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
    },
    { timestamps: true }
);

const ProfileInfo = mongoose.model('ProfileInfo', profileInfoSchema);

module.exports = ProfileInfo;
