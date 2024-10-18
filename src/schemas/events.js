// schemas/events.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        location: { type: String, required: true },
        date: { type: Date, required: true },
        requiredSkills: [
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
        volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProfileInfo' }],
        status: {
            type: String,
            enum: ['open', 'filled', 'completed', 'cancelled'],
            default: 'open'
        },
        imageUrl: { type: String }
    },
    { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
