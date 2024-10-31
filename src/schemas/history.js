// schemas/history.js
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        historyList: { type: [String], default: [] },
        matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Histories' }],
    },
    { timestamps: true }
);

const historyProfile = mongoose.model('UserHistories', historySchema);

module.exports = historyProfile;