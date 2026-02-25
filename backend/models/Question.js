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
    topic: {
        type: String,
        enum: ['Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Binary Search', 
               'Linked List', 'Trees', 'Tries', 'Heap / Priority Queue', 'Backtracking', 
               'Graphs', 'Advanced Graphs', '1-D DP', '2-D DP', 'Greedy', 'Intervals', 
               'Math & Geometry', 'Bit Manipulation'],
        required: true
    },
    starterCode: {
        c: String,
        cpp: String,
        java: String,
        python: String,
        javascript: String
    },
    functionName: {
        type: String,
        default: 'solution' // Default function name if not specified
    },
    // Free content
    hints: [String],
    timeComplexity: String,
    spaceComplexity: String,
    basicExplanation: String,
    
    // Premium content
    isPremium: {
        type: Boolean,
        default: false
    },
    videoUrl: String, // YouTube/Vimeo link
    videoLength: String, // "12:34"
    detailedSolution: {
        approach: String,
        code: {
            python: String,
            javascript: String,
            java: String,
            cpp: String
        },
        walkthrough: String
    },
    interviewTips: [String],
    relatedProblems: [String], // Array of questionIds
    companies: [String], // ['Google', 'Meta', 'Amazon', etc.]
    
    // NeetCode lists
    neetCodeLists: {
        blind75: Boolean,
        neetCode150: Boolean,
        neetCode250: Boolean
    },
    
    // Stats
    acceptanceRate: Number,
    totalSubmissions: {
        type: Number,
        default: 0
    },
    totalAccepted: {
        type: Number,
        default: 0
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question', questionSchema);
