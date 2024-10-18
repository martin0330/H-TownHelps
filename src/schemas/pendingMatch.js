const mongoose = require('mongoose');

const pendingMatchSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileInfo', required: true },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    status: {
        type: String,
        enum: ['pending', 'reviewed'],
        default: 'pending'
    }
}, { timestamps: true });

const PendingMatch = mongoose.model('PendingMatch', pendingMatchSchema);

module.exports = PendingMatch;



