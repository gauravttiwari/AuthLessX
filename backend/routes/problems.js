const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/problems
 * Get all problems with filtering
 * Query params: topic, difficulty, list (blind75, authlessx150, etc.), status, search
 */
router.get('/', async (req, res) => {
    try {
        const { topic, difficulty, list, status, search, page = 1, limit = 50 } = req.query;
        const userId = req.user?.userId;

        let query = {};

        // Filter by topic
        if (topic && topic !== 'all') {
            query.topic = topic;
        }

        // Filter by difficulty
        if (difficulty) {
            const difficulties = difficulty.split(',');
            query.difficulty = { $in: difficulties };
        }

        // Filter by AuthLessX lists
        if (list && list !== 'all') {
            if (list === 'blind75') query['neetCodeLists.blind75'] = true;
            else if (list === 'authlessx150' || list === 'neetcode150') query['neetCodeLists.neetCode150'] = true;
            else if (list === 'authlessx250' || list === 'neetcode250') query['neetCodeLists.neetCode250'] = true;
            else if (list === 'authlessx-all' || list === 'neetcodeall') query['neetCodeLists.neetCode250'] = true;
        }

        // Search by title
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        // Get problems
        const problems = await Question.find(query)
            .select('questionId title topic difficulty acceptanceRate isPremium videoUrl neetCodeLists companies')
            .sort({ 'neetCodeLists.blind75': -1, topic: 1, difficulty: 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Get user's solved problems if authenticated
        let solvedProblems = [];
        if (userId) {
            const user = await User.findById(userId).select('solvedProblems');
            solvedProblems = user?.solvedProblems?.map(sp => sp.questionId) || [];
        }

        // Add solved status
        const problemsWithStatus = problems.map(problem => ({
            ...problem.toObject(),
            isSolved: solvedProblems.includes(problem.questionId)
        }));

        // Apply status filter after adding solved status
        let filteredProblems = problemsWithStatus;
        if (status) {
            if (status === 'solved') {
                filteredProblems = problemsWithStatus.filter(p => p.isSolved);
            } else if (status === 'unsolved') {
                filteredProblems = problemsWithStatus.filter(p => !p.isSolved);
            }
        }

        const total = await Question.countDocuments(query);

        res.json({
            success: true,
            data: {
                problems: filteredProblems,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch problems',
            error: error.message
        });
    }
});

/**
 * GET /api/problems/:questionId
 * Get detailed problem information
 */
router.get('/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const userId = req.user?.userId;

        const problem = await Question.findOne({ questionId });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        // Check if user is premium
        let isPremiumUser = false;
        if (userId) {
            const user = await User.findById(userId).select('isPremium premiumEndDate');
            isPremiumUser = user?.isPremium && (!user.premiumEndDate || user.premiumEndDate > new Date());
        }

        // Prepare response based on premium status
        const response = {
            questionId: problem.questionId,
            type: problem.type,
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            topic: problem.topic,
            timeLimit: problem.timeLimit,
            constraints: problem.constraints,
            examples: problem.examples,
            tags: problem.tags,
            starterCode: problem.starterCode,
            hints: problem.hints,
            timeComplexity: problem.timeComplexity,
            spaceComplexity: problem.spaceComplexity,
            basicExplanation: problem.basicExplanation,
            acceptanceRate: problem.acceptanceRate,
            totalSubmissions: problem.totalSubmissions,
            totalAccepted: problem.totalAccepted,
            companies: problem.companies,
            relatedProblems: problem.relatedProblems,
            neetCodeLists: problem.neetCodeLists,
            // Test cases (only visible samples)
            sampleTestCases: problem.testCases.filter(tc => !tc.isHidden).map(tc => ({
                input: tc.input,
                expectedOutput: tc.expectedOutput
            })),
            isPremium: problem.isPremium
        };

        // Add premium content if user is premium
        if (isPremiumUser || !problem.isPremium) {
            response.videoUrl = problem.videoUrl;
            response.videoLength = problem.videoLength;
            response.detailedSolution = problem.detailedSolution;
            response.interviewTips = problem.interviewTips;
            response.hasPremiumAccess = true;
        } else {
            response.hasPremiumAccess = false;
        }

        res.json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch problem',
            error: error.message
        });
    }
});

/**
 * GET /api/problems/stats/overview
 * Get problem statistics
 */
router.get('/stats/overview', async (req, res) => {
    try {
        const total = await Question.countDocuments();
        const easy = await Question.countDocuments({ difficulty: 'Easy' });
        const medium = await Question.countDocuments({ difficulty: 'Medium' });
        const hard = await Question.countDocuments({ difficulty: 'Hard' });
        const premium = await Question.countDocuments({ isPremium: true });

        // Topics breakdown
        const topics = await Question.aggregate([
            { $group: { _id: '$topic', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                total,
                difficulty: { easy, medium, hard },
                premium,
                topics: topics.map(t => ({ topic: t._id, count: t.count }))
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

/**
 * POST /api/problems/:questionId/submit
 * Submit solution for a problem
 */
router.post('/:questionId/submit', authenticateToken, async (req, res) => {
    try {
        const { questionId } = req.params;
        const { code, language } = req.body;
        const userId = req.user.userId;

        const problem = await Question.findOne({ questionId });
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        // Here you would integrate with Judge0 or similar service
        // For now, return a mock response
        const isAccepted = true; // Placeholder

        // Update user's solved problems
        if (isAccepted) {
            await User.findByIdAndUpdate(userId, {
                $addToSet: {
                    solvedProblems: {
                        questionId,
                        solvedAt: new Date(),
                        language,
                        timeTaken: 0 // Track this from frontend timer
                    }
                }
            });

            // Update problem stats
            await Question.findOneAndUpdate(
                { questionId },
                {
                    $inc: {
                        totalSubmissions: 1,
                        totalAccepted: 1
                    }
                }
            );
        } else {
            await Question.findOneAndUpdate(
                { questionId },
                { $inc: { totalSubmissions: 1 } }
            );
        }

        res.json({
            success: true,
            data: {
                accepted: isAccepted,
                message: isAccepted ? 'Accepted! Great job!' : 'Wrong answer',
                testsPassed: isAccepted ? problem.testCases.length : 3,
                totalTests: problem.testCases.length
            }
        });
    } catch (error) {
        console.error('Error submitting solution:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit solution',
            error: error.message
        });
    }
});

module.exports = router;
