const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    duration: String, // "25 hours"
    isPremium: {
        type: Boolean,
        default: true
    },
    thumbnail: String,
    instructor: {
        name: String,
        avatar: String,
        bio: String
    },
    sections: [{
        sectionId: String,
        title: String,
        order: Number,
        lessons: [{
            lessonId: String,
            title: String,
            videoUrl: String,
            videoLength: String, // "15:30"
            description: String,
            resources: [{
                type: String, // 'code', 'article', 'slides'
                url: String,
                title: String
            }],
            relatedProblems: [String], // questionIds
            order: Number
        }]
    }],
    tags: [String],
    enrolledCount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);
