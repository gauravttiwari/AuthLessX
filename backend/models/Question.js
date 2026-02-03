const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['DSA', 'Programming'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    timeLimit: {
        type: Number, // in minutes
        required: true,
        default: 30
    },
    testCases: [{
        input: String,
        expectedOutput: String,
        isHidden: {
            type: Boolean,
            default: false
        }
    }],
    constraints: String,
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    tags: [String], // ['Array', 'Sorting', 'DP', etc.]
    starterCode: {
        c: String,
        cpp: String,
        java: String,
        python: String,
        javascript: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question', questionSchema);
