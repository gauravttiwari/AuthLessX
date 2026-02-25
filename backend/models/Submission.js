const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['experience', 'question'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    
    // Common fields
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
    },
    
    // Interview Experience fields
    companyType: String,
    role: String,
    experienceLevel: String,
    companyName: String,
    rounds: String,
    questions: String,
    tips: String,
    
    // Question fields
    title: String,
    description: String,
    category: String,
    sampleInput: String,
    sampleOutput: String,
    testCases: String,
    tags: String,
    
    // Reward
    rewardCoins: {
        type: Number,
        default: 0
    },
    
    // Admin review
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: Date,
    reviewNotes: String,
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Submission', submissionSchema);
