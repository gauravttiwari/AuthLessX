const express = require('express');
const router = express.Router();
const axios = require('axios');
const Question = require('../models/Question');
const CodingAttempt = require('../models/CodingAttempt');
const { authenticateToken } = require('../middleware/auth');

// Judge0 API Configuration (Free tier)
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || 'your_rapidapi_key_here';

// Language ID mapping for Judge0
const LANGUAGE_IDS = {
    c: 50,          // C (GCC 9.2.0)
    cpp: 54,        // C++ (GCC 9.2.0)
    java: 62,       // Java (OpenJDK 13.0.1)
    python: 71,     // Python (3.8.1)
    javascript: 63  // JavaScript (Node.js 12.14.0)
};

/**
 * GET /api/coding/categories
 * Get available coding question categories
 */
router.get('/categories', authenticateToken, (req, res) => {
    res.json({
        success: true,
        data: {
            categories: [
                {
                    id: 'DSA',
                    name: 'Data Structures & Algorithms',
                    description: 'Practice DSA problems',
                    icon: '🧩'
                },
                {
                    id: 'Programming',
                    name: 'Programming Basics',
                    description: 'Core programming concepts',
                    icon: '💻'
                }
            ]
        }
    });
});

/**
 * GET /api/coding/questions/:type
 * Get a random question by type (DSA/Programming)
 * Query params: difficulty (Easy/Medium/Hard)
 */
router.get('/questions/:type', authenticateToken, async (req, res) => {
    try {
        const { type } = req.params;
        const { difficulty } = req.query;

        if (!['DSA', 'Programming'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid type. Choose DSA or Programming'
            });
        }

        const query = { type };
        if (difficulty) {
            query.difficulty = difficulty;
        }

        // Get random question
        const count = await Question.countDocuments(query);
        const random = Math.floor(Math.random() * count);
        const question = await Question.findOne(query).skip(random);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'No questions found for this category'
            });
        }

        // Don't send test cases with expected outputs to frontend (prevent cheating)
        const safeQuestion = {
            questionId: question.questionId,
            type: question.type,
            title: question.title,
            description: question.description,
            difficulty: question.difficulty,
            timeLimit: question.timeLimit,
            constraints: question.constraints,
            examples: question.examples,
            tags: question.tags,
            starterCode: question.starterCode,
            sampleTestCases: question.testCases.filter(tc => !tc.isHidden).map(tc => ({
                input: tc.input,
                expectedOutput: tc.expectedOutput
            }))
        };

        res.json({
            success: true,
            data: safeQuestion
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch question',
            error: error.message
        });
    }
});

/**
 * POST /api/coding/submit
 * Submit code for evaluation
 */
router.post('/submit', authenticateToken, async (req, res) => {
    try {
        const { questionId, language, code, timeTaken } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!questionId || !language || !code || timeTaken === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Question ID, language, code, and time taken are required'
            });
        }

        if (!LANGUAGE_IDS[language]) {
            return res.status(400).json({
                success: false,
                message: 'Unsupported language'
            });
        }

        // Get question with test cases
        const question = await Question.findOne({ questionId });
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check time limit
        if (timeTaken > question.timeLimit * 60) {
            const attempt = new CodingAttempt({
                userId,
                questionId: question.questionId,
                questionTitle: question.title,
                questionType: question.type,
                language,
                code,
                status: 'Time Limit Exceeded',
                score: 0,
                timeTaken,
                testCasesPassed: 0,
                totalTestCases: question.testCases.length,
                feedback: 'You exceeded the time limit for this question.'
            });
            await attempt.save();

            return res.json({
                success: true,
                data: {
                    status: 'Time Limit Exceeded',
                    score: 0,
                    testCasesPassed: 0,
                    totalTestCases: question.testCases.length,
                    feedback: 'Time limit exceeded',
                    attemptId: attempt._id
                }
            });
        }

        // Execute code against test cases
        const results = await executeCodeWithTestCases(
            code,
            language,
            question.testCases
        );

        // Calculate score
        const testCasesPassed = results.filter(r => r.passed).length;
        const totalTestCases = question.testCases.length;
        const baseScore = Math.round((testCasesPassed / totalTestCases) * 70);
        
        // Time bonus (max 20 points)
        const timePercentage = timeTaken / (question.timeLimit * 60);
        const timeBonus = Math.round((1 - timePercentage) * 20);
        
        // Code quality bonus (10 points for all passed)
        const qualityBonus = testCasesPassed === totalTestCases ? 10 : 0;
        
        const finalScore = Math.min(baseScore + timeBonus + qualityBonus, 100);

        // Determine status
        let status = 'Correct';
        let feedback = 'Great job! All test cases passed.';
        let errorMessage = '';

        if (results.some(r => r.error && r.error.includes('Compilation Error'))) {
            status = 'Compilation Error';
            feedback = 'Your code has compilation errors. Please check syntax.';
            errorMessage = results.find(r => r.error)?.error || '';
        } else if (results.some(r => r.error && r.error.includes('Runtime Error'))) {
            status = 'Runtime Error';
            feedback = 'Your code encountered a runtime error. Check for null pointers, array bounds, etc.';
            errorMessage = results.find(r => r.error)?.error || '';
        } else if (testCasesPassed < totalTestCases) {
            status = 'Wrong Answer';
            feedback = `You passed ${testCasesPassed} out of ${totalTestCases} test cases. Review your logic for edge cases.`;
        }

        // Save attempt
        const attempt = new CodingAttempt({
            userId,
            questionId: question.questionId,
            questionTitle: question.title,
            questionType: question.type,
            language,
            code,
            status,
            score: finalScore,
            timeTaken,
            testCasesPassed,
            totalTestCases,
            errorMessage,
            feedback
        });
        await attempt.save();

        res.json({
            success: true,
            data: {
                status,
                score: finalScore,
                testCasesPassed,
                totalTestCases,
                timeTaken,
                feedback,
                errorMessage: status !== 'Correct' ? errorMessage : undefined,
                testResults: results.map(r => ({
                    passed: r.passed,
                    input: r.input,
                    expectedOutput: r.expectedOutput,
                    actualOutput: r.actualOutput
                })),
                attemptId: attempt._id
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit code',
            error: error.message
        });
    }
});

/**
 * Helper function to execute code with test cases
 * Uses Judge0 API or fallback to eval for simple cases
 */
async function executeCodeWithTestCases(code, language, testCases) {
    const results = [];

    for (const testCase of testCases) {
        try {
            // For demo purposes, using simple evaluation
            // In production, integrate with Judge0 API
            const result = await executeCode(code, language, testCase.input);
            
            results.push({
                input: testCase.input,
                expectedOutput: testCase.expectedOutput.trim(),
                actualOutput: result.output.trim(),
                passed: result.output.trim() === testCase.expectedOutput.trim(),
                error: result.error
            });
        } catch (error) {
            results.push({
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: '',
                passed: false,
                error: error.message
            });
        }
    }

    return results;
}

/**
 * Execute code using Judge0 API (or local execution for demo)
 */
async function executeCode(code, language, input) {
    // For demo: Simple JavaScript execution
    if (language === 'javascript') {
        try {
            // This is unsafe in production - use Judge0 API instead
            const capturedOutput = [];
            const mockConsole = {
                log: (...args) => capturedOutput.push(args.join(' '))
            };
            
            const wrappedCode = `
                const console = mockConsole;
                ${code}
            `;
            
            const func = new Function('mockConsole', wrappedCode);
            func(mockConsole);
            
            return {
                output: capturedOutput.join('\n'),
                error: null
            };
        } catch (error) {
            return {
                output: '',
                error: `Runtime Error: ${error.message}`
            };
        }
    }

    // For other languages, integrate Judge0 API here
    // Example Judge0 integration (commented for now):
    /*
    const submission = await axios.post(
        `${JUDGE0_API_URL}/submissions`,
        {
            source_code: Buffer.from(code).toString('base64'),
            language_id: LANGUAGE_IDS[language],
            stdin: Buffer.from(input).toString('base64')
        },
        {
            headers: {
                'X-RapidAPI-Key': JUDGE0_API_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        }
    );

    // Poll for result
    const token = submission.data.token;
    let result;
    for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await axios.get(
            `${JUDGE0_API_URL}/submissions/${token}`,
            {
                headers: {
                    'X-RapidAPI-Key': JUDGE0_API_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            }
        );
        
        if (response.data.status.id > 2) {
            result = response.data;
            break;
        }
    }

    return {
        output: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '',
        error: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : null
    };
    */

    return {
        output: 'Judge0 API integration pending',
        error: 'Please integrate Judge0 API for ' + language
    };
}

/**
 * GET /api/coding/history
 * Get user's coding attempt history
 */
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type, limit = 20 } = req.query;

        const query = { userId };
        if (type) {
            query.questionType = type;
        }

        const attempts = await CodingAttempt.find(query)
            .sort({ submittedAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: attempts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch coding history'
        });
    }
});

/**
 * GET /api/coding/stats
 * Get user's coding statistics
 */
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const attempts = await CodingAttempt.find({ userId });

        const stats = {
            totalAttempts: attempts.length,
            averageScore: 0,
            correctSubmissions: 0,
            byType: {
                DSA: { attempts: 0, avgScore: 0, correct: 0 },
                Programming: { attempts: 0, avgScore: 0, correct: 0 }
            },
            byLanguage: {}
        };

        if (attempts.length > 0) {
            const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
            stats.averageScore = Math.round(totalScore / attempts.length);
            stats.correctSubmissions = attempts.filter(a => a.status === 'Correct').length;

            // By type
            ['DSA', 'Programming'].forEach(type => {
                const typeAttempts = attempts.filter(a => a.questionType === type);
                if (typeAttempts.length > 0) {
                    const typeScore = typeAttempts.reduce((sum, a) => sum + a.score, 0);
                    stats.byType[type] = {
                        attempts: typeAttempts.length,
                        avgScore: Math.round(typeScore / typeAttempts.length),
                        correct: typeAttempts.filter(a => a.status === 'Correct').length
                    };
                }
            });

            // By language
            attempts.forEach(attempt => {
                if (!stats.byLanguage[attempt.language]) {
                    stats.byLanguage[attempt.language] = {
                        attempts: 0,
                        avgScore: 0,
                        totalScore: 0
                    };
                }
                stats.byLanguage[attempt.language].attempts++;
                stats.byLanguage[attempt.language].totalScore += attempt.score;
            });

            Object.keys(stats.byLanguage).forEach(lang => {
                const langStats = stats.byLanguage[lang];
                langStats.avgScore = Math.round(langStats.totalScore / langStats.attempts);
                delete langStats.totalScore;
            });
        }

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch coding statistics'
        });
    }
});

/**
 * GET /api/coding/languages
 * Get supported programming languages
 */
router.get('/languages', authenticateToken, (req, res) => {
    res.json({
        success: true,
        data: {
            languages: [
                { id: 'c', name: 'C', icon: '🔷' },
                { id: 'cpp', name: 'C++', icon: '🔶' },
                { id: 'java', name: 'Java', icon: '☕' },
                { id: 'python', name: 'Python', icon: '🐍' },
                { id: 'javascript', name: 'JavaScript', icon: '🟨' }
            ]
        }
    });
});

module.exports = router;
