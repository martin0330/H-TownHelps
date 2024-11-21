const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        historyList: [
            {
                date: { type: Date, required: true }, // Date field
                description: { type: String, required: true }, // String description
            },
        ],
        matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Histories' }],
    },
    { timestamps: true }
);

const historyProfile = mongoose.model('UserHistories', historySchema);

module.exports = historyProfile;
