const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    challenge: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Challenge expires after 5 minutes
    }
});

module.exports = mongoose.model('Challenge', challengeSchema);
