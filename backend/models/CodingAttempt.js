const mongoose = require('mongoose');

const codingAttemptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: String,
        required: true
    },
    questionTitle: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ['DSA', 'Programming'],
        required: true
    },
    language: {
        type: String,
        enum: ['c', 'cpp', 'java', 'python', 'javascript'],
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Correct', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error'],
        required: true
    },
    score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    timeTaken: {
        type: Number, // in seconds
        required: true
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    totalTestCases: {
        type: Number,
        required: true
    },
    errorMessage: String,
    feedback: String, // AI-generated or predefined feedback
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
codingAttemptSchema.index({ userId: 1, submittedAt: -1 });

module.exports = mongoose.model('CodingAttempt', codingAttemptSchema);
