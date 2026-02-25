const express = require('express');
const router = express.Router();
const axios = require('axios');
const Question = require('../models/Question');
const CodingAttempt = require('../models/CodingAttempt');
const { authenticateToken } = require('../middleware/auth');

// Supported languages for Piston API
const SUPPORTED_LANGUAGES = ['python', 'javascript', 'java', 'cpp', 'c'];

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
        console.log('📥 Received submission request');
        console.log('Body:', { questionId: req.body.questionId, language: req.body.language, codeLength: req.body.code?.length, timeTaken: req.body.timeTaken });
        
        const { questionId, language, code, timeTaken } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!questionId || !language || !code || timeTaken === undefined) {
            console.log('❌ Validation failed:', { questionId: !!questionId, language: !!language, code: !!code, timeTaken: timeTaken !== undefined });
            return res.status(400).json({
                success: false,
                message: 'Question ID, language, code, and time taken are required'
            });
        }

        if (!SUPPORTED_LANGUAGES.includes(language)) {
            console.log('❌ Unsupported language:', language);
            return res.status(400).json({
                success: false,
                message: `Unsupported language: ${language}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`
            });
        }

        // Get question with test cases
        const question = await Question.findOne({ questionId });
        if (!question) {
            console.log('❌ Question not found:', questionId);
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        console.log('✓ Question found:', question.title);
        console.log('✓ Test cases:', question.testCases.length);

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
        console.log('🚀 Executing code...');
        console.log('Function name:', question.functionName || 'solution');
        const results = await executeCodeWithTestCases(
            code,
            language,
            question.testCases,
            question.functionName || 'solution'
        );
        console.log('✓ Execution complete, results:', results.length);

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
        console.error('❌ Submit error:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Failed to submit code',
            error: error.message
        });
    }
});

/**
 * Helper function to execute code with test cases
 * Uses Judge0 API for safe code execution
 */
async function executeCodeWithTestCases(code, language, testCases, functionName = 'solution') {
    const results = [];

    for (const testCase of testCases) {
        try {
            const result = await executeCode(code, language, testCase.input, functionName);
            
            // Clean and normalize outputs
            const expectedOutput = normalizeOutput(testCase.expectedOutput);
            const actualOutput = normalizeOutput(result.output);
            
            // Check if outputs match
            const passed = actualOutput === expectedOutput;
            
            results.push({
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: result.output,
                passed: passed,
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
 * Normalize output for comparison
 * Removes extra whitespace, trailing newlines, handles Python/JS differences
 */
function normalizeOutput(output) {
    if (!output) return '';
    
    return output
        .toString()
        .trim()
        .replace(/\r\n/g, '\n')      // Normalize line endings
        .replace(/\s+$/gm, '')       // Remove trailing whitespace from each line
        .replace(/^\s+/gm, '')       // Remove leading whitespace from each line
        .replace(/\n+/g, '\n')       // Normalize multiple newlines to single
        .replace(/,\s+/g, ',')       // Remove spaces after commas for JSON arrays
        .replace(/\[\s+/g, '[')      // Remove spaces after opening brackets
        .replace(/\s+\]/g, ']')      // Remove spaces before closing brackets
        .replace(/\{\s+/g, '{')      // Remove spaces after opening braces
        .replace(/\s+\}/g, '}')      // Remove spaces before closing braces
        .replace(/:\s+/g, ':')       // Remove spaces after colons in JSON
        .replace(/\bTrue\b/g, 'true')   // Python True → JavaScript true
        .replace(/\bFalse\b/g, 'false') // Python False → JavaScript false
        .replace(/\bNone\b/g, 'null')   // Python None → JavaScript null
        .replace(/\s+/g, ' ')        // Normalize multiple spaces to single
        .toLowerCase();              // Case-insensitive comparison
}

/**
 * Execute code using Judge0 CE API (Free Code Execution Service)
 * Supports: Python, JavaScript, Java, C, C++, and 70+ languages
 */
async function executeCode(code, language, input, functionName = 'solution') {
    const JUDGE0_API_URL = 'https://ce.judge0.com';
    
    // Language ID mapping for Judge0
    const languageIds = {
        'python': 71,      // Python 3.8.1 
        'javascript': 63,  // JavaScript (Node.js 12.14.0)
        'java': 62,        // Java (OpenJDK 13.0.1)
        'cpp': 54,         // C++ (GCC 9.2.0)
        'c': 50            // C (GCC 9.2.0)
    };
    
    const languageId = languageIds[language];
    if (!languageId) {
        return {
            output: '',
            error: `Unsupported language: ${language}`
        };
    }
    
    // Wrap code to handle input/output properly
    const wrappedCode = wrapCode(code, language, input, functionName);

    try {
        console.log(`🔄 Calling Judge0 API for ${language}...`);
        
        // Submit code to Judge0 with timeout
        const submitResponse = await axios.post(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`, {
            source_code: wrappedCode,
            language_id: languageId,
            stdin: '',
            expected_output: null
        }, {
            timeout: 30000, // 30 seconds timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = submitResponse.data;
        console.log(`✅ Judge0 Response - Status: ${result.status.id} (${result.status.description})`);

        // Check compilation error
        if (result.status.id === 6) { // Compilation Error
            return {
                output: '',
                error: `Compilation Error: ${result.compile_output || 'Unknown compilation error'}`
            };
        }

        // Check runtime error
        if (result.status.id === 11 || result.status.id === 12) { // Runtime Error
            return {
                output: result.stdout || '',
                error: `Runtime Error: ${result.stderr || 'Process exited with error'}`
            };
        }

        // Check Time Limit Exceeded
        if (result.status.id === 5) {
            return {
                output: result.stdout || '',
                error: 'Time Limit Exceeded'
            };
        }

        // Success (status.id === 3)
        return {
            output: result.stdout || '',
            error: result.stderr || null
        };

    } catch (error) {
        console.error('Judge0 API Error:', error.response?.data || error.message);
        
        // Handle specific error types
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            return {
                output: '',
                error: 'Execution Timeout: Code execution took too long (30s limit). Please optimize your code.'
            };
        }
        
        if (error.response?.status === 429) {
            return {
                output: '',
                error: 'Rate Limit: Too many requests. Please wait a moment and try again.'
            };
        }
        
        return {
            output: '',
            error: `Execution Error: ${error.response?.data?.message || error.message}`
        };
    }
}

/**
 * Wrap user code to handle input/output dynamically
 */
function wrapCode(code, language, input, functionName = 'solution') {
    if (language === 'python') {
        // Parse input lines
        return `
import json
import sys

${code}

# Parse input and call function dynamically
try:
    input_lines = """${input.replace(/"/g, '\\"')}""".strip().split('\\n')
    
    # Parse parameters
    params = []
    for line in input_lines:
        # Check if line exists (not None), even if it's empty after strip
        if line is not None:
            stripped_line = line.strip()
            # If line is empty or just whitespace, treat as empty string parameter
            if not stripped_line:
                params.append(line)  # Keep original (with spaces) for string inputs
            else:
                try:
                    # Try to parse as JSON
                    if stripped_line.startswith('[') or stripped_line.startswith('{'):
                        params.append(json.loads(stripped_line))
                    elif stripped_line.lower() == 'true':
                        params.append(True)
                    elif stripped_line.lower() == 'false':
                        params.append(False)
                    elif stripped_line.isdigit() or (stripped_line.startswith('-') and stripped_line[1:].isdigit()):
                        params.append(int(stripped_line))
                    else:
                        # Try as number
                        try:
                            params.append(float(stripped_line))
                        except:
                            # Keep as string
                            params.append(line)
                except:
                    params.append(line)
    
    # Call the function with parsed parameters
    if '${functionName}' in dir():
        result = ${functionName}(*params)
    else:
        result = None
        print("Function ${functionName} not found", file=sys.stderr)
    
    # Print result as JSON without spaces (compact format)
    if result is not None:
        print(json.dumps(result, separators=(',', ':')))
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
`;
    } else if (language === 'javascript') {
        return `
${code}

// Parse input and call function
try {
    const inputLines = \`${input.replace(/`/g, '\\`')}\`.trim().split('\\n');
    
    // Parse parameters
    const params = [];
    for (const line of inputLines) {
        if (line.trim()) {
            try {
                if (line.startsWith('[') || line.startsWith('{')) {
                    params.push(JSON.parse(line));
                } else if (line.toLowerCase() === 'true') {
                    params.push(true);
                } else if (line.toLowerCase() === 'false') {
                    params.push(false);
                } else if (!isNaN(line)) {
                    params.push(Number(line));
                } else {
                    params.push(line);
                }
            } catch {
                params.push(line);
            }
        }
    }
    
    // Call function
    const result = typeof ${functionName} !== 'undefined' ? ${functionName}(...params) : null;
    
    if (result !== null && result !== undefined) {
        // Print compact JSON without spaces
        console.log(JSON.stringify(result).replace(/,\s+/g, ',').replace(/:\s+/g, ':'));
    }
} catch (e) {
    console.error('Error:', e.message);
}
`;
    }
    
    // For other languages, return code as-is for now
    return code;
}

/**
 * Get proper filename for each language
 */
function getFileName(language) {
    const fileNames = {
        'python': 'main.py',
        'javascript': 'main.js',
        'java': 'Main.java',
        'cpp': 'main.cpp',
        'c': 'main.c'
    };
    return fileNames[language] || 'main.txt';
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
