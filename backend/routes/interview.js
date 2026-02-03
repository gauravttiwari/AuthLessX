const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const { authenticateToken } = require('../middleware/auth');

// Mock interview questions database
const questions = {
    technical: [
        { id: 1, question: "What is the difference between var, let, and const in JavaScript?", options: ["Scope and reassignment", "Only syntax", "No difference", "Performance"], correct: 0 },
        { id: 2, question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
        { id: 3, question: "What is REST API?", options: ["Database", "Programming Language", "Architectural style for web services", "Framework"], correct: 2 },
        { id: 4, question: "What is the purpose of async/await in JavaScript?", options: ["To make code slower", "To handle asynchronous operations", "To create loops", "To define variables"], correct: 1 },
        { id: 5, question: "What is SQL injection?", options: ["A security vulnerability", "A database feature", "A query optimizer", "A programming language"], correct: 0 }
    ],
    hr: [
        { id: 1, question: "Why should we hire you?", options: ["I need money", "My skills match requirements", "I have no choice", "Random"], correct: 1 },
        { id: 2, question: "What are your strengths?", options: ["Problem-solving and teamwork", "Sleeping", "Gaming", "Procrastinating"], correct: 0 },
        { id: 3, question: "Where do you see yourself in 5 years?", options: ["Growing with company", "Still interviewing", "Retired", "Don't know"], correct: 0 },
        { id: 4, question: "How do you handle pressure?", options: ["I prioritize and stay organized", "I panic", "I quit", "I ignore it"], correct: 0 },
        { id: 5, question: "Why did you leave your last job?", options: ["Seeking growth opportunities", "Got fired", "Too lazy", "Didn't like boss"], correct: 0 }
    ],
    aptitude: [
        { id: 1, question: "If 5 workers complete a task in 10 days, how many days will 10 workers take?", options: ["5 days", "15 days", "20 days", "10 days"], correct: 0 },
        { id: 2, question: "What is 15% of 200?", options: ["30", "25", "35", "20"], correct: 0 },
        { id: 3, question: "Complete the series: 2, 4, 8, 16, __", options: ["20", "24", "32", "18"], correct: 2 },
        { id: 4, question: "A train travels 60 km in 1 hour. How far will it travel in 3.5 hours?", options: ["180 km", "210 km", "240 km", "200 km"], correct: 1 },
        { id: 5, question: "What is the next number: 1, 1, 2, 3, 5, 8, __?", options: ["11", "13", "15", "10"], correct: 1 }
    ],
    coding: [
        { id: 1, type: 'redirect', message: 'Use /api/coding endpoints for coding questions' }
    ]
};

/**
 * GET /api/interview/questions/:category
 * Get interview questions by category
 */
router.get('/questions/:category', authenticateToken, (req, res) => {
    try {
        const { category } = req.params;

        // Redirect coding category to dedicated endpoint
        if (category === 'coding') {
            return res.status(200).json({
                success: true,
                redirect: true,
                message: 'Please use /api/coding endpoints for coding questions',
                endpoint: '/api/coding/categories'
            });
        }

        if (!questions[category]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category. Choose: technical, hr, aptitude, or coding'
            });
        }

        res.json({
            success: true,
            data: {
                category,
                questions: questions[category]
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch questions'
        });
    }
});

/**
 * POST /api/interview/submit
 * Submit interview answers and get results
 */
router.post('/submit', authenticateToken, async (req, res) => {
    try {
        const { category, answers, timeTaken } = req.body;
        const userId = req.user.userId;

        if (!category || !answers || !timeTaken) {
            return res.status(400).json({
                success: false,
                message: 'Category, answers, and timeTaken are required'
            });
        }

        // Validate category
        if (!questions[category]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category'
            });
        }

        // Calculate score
        const categoryQuestions = questions[category];
        let correctAnswers = 0;

        answers.forEach((answer, index) => {
            if (categoryQuestions[index] && answer === categoryQuestions[index].correct) {
                correctAnswers++;
            }
        });

        const totalQuestions = categoryQuestions.length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);

        // Generate feedback
        let feedback;
        if (score >= 80) {
            feedback = "Excellent! You have strong knowledge in this area.";
        } else if (score >= 60) {
            feedback = "Good performance! Keep practicing to improve further.";
        } else if (score >= 40) {
            feedback = "Fair performance. Review the concepts and practice more.";
        } else {
            feedback = "Need improvement. Focus on fundamentals and practice regularly.";
        }

        // Save interview result
        const interview = new Interview({
            userId,
            category,
            score,
            totalQuestions,
            correctAnswers,
            timeTaken,
            feedback
        });

        await interview.save();

        res.json({
            success: true,
            message: 'Interview submitted successfully',
            data: {
                score,
                correctAnswers,
                totalQuestions,
                timeTaken,
                feedback,
                interviewId: interview._id
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit interview',
            error: error.message
        });
    }
});

/**
 * GET /api/interview/history
 * Get user's interview history
 */
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const interviews = await Interview.find({ userId })
            .sort({ completedAt: -1 })
            .limit(20);

        res.json({
            success: true,
            data: interviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch interview history'
        });
    }
});

/**
 * GET /api/interview/stats
 * Get user's performance statistics
 */
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const interviews = await Interview.find({ userId });

        const stats = {
            totalInterviews: interviews.length,
            averageScore: 0,
            byCategory: {
                technical: { count: 0, avgScore: 0 },
                hr: { count: 0, avgScore: 0 },
                aptitude: { count: 0, avgScore: 0 }
            }
        };

        if (interviews.length > 0) {
            const totalScore = interviews.reduce((sum, interview) => sum + interview.score, 0);
            stats.averageScore = Math.round(totalScore / interviews.length);

            // Calculate category-wise stats
            ['technical', 'hr', 'aptitude'].forEach(category => {
                const categoryInterviews = interviews.filter(i => i.category === category);
                if (categoryInterviews.length > 0) {
                    const categoryScore = categoryInterviews.reduce((sum, i) => sum + i.score, 0);
                    stats.byCategory[category] = {
                        count: categoryInterviews.length,
                        avgScore: Math.round(categoryScore / categoryInterviews.length)
                    };
                }
            });
        }

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

module.exports = router;
