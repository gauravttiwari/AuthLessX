const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testValidPalindrome() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Create test user
        const testUsername = `test_palindrome_${Date.now()}`;
        const testEmail = `${testUsername}@test.com`;

        let user = await User.findOne({ email: testEmail });
        if (!user) {
            user = new User({
                name: testUsername,
                email: testEmail,
                publicKey: 'test-public-key'
            });
            await user.save();
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('🧪 Testing Valid Palindrome (ID: 125) - Edge Case Fix\n');
        console.log('='.repeat(80));

        const palindromeCode = `def isPalindrome(s):
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    return cleaned == cleaned[::-1]`;

        const response = await axios.post('http://localhost:5000/api/coding/submit', {
            questionId: '125',
            language: 'python',
            code: palindromeCode,
            timeTaken: 120
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = response.data;
        
        console.log('\n📊 RESULTS:');
        console.log('Status:', result.data.status);
        console.log('Score:', result.data.score);
        console.log('Test Cases Passed:', `${result.data.testCasesPassed}/${result.data.totalTestCases}`);
        
        console.log('\n📝 Detailed Test Results:');
        console.log('-'.repeat(80));
        
        result.data.testResults.forEach((test, index) => {
            console.log(`\nTest Case ${index + 1}:`);
            console.log(`  Input: "${test.input}"`);
            console.log(`  Expected: ${test.expectedOutput}`);
            console.log(`  Actual: ${test.actualOutput}`);
            console.log(`  Status: ${test.passed ? '✅ PASSED' : '❌ FAILED'}`);
            if (test.error) {
                console.log(`  Error: ${test.error}`);
            }
        });

        console.log('\n' + '='.repeat(80));
        
        if (result.data.testCasesPassed === result.data.totalTestCases) {
            console.log('🎉 ALL TEST CASES PASSED! Edge case fixed! ✅\n');
        } else {
            console.log(`⚠️  ${result.data.totalTestCases - result.data.testCasesPassed} test case(s) still failing.\n`);
        }

        // Cleanup
        await User.deleteOne({ email: testEmail });
        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ TEST FAILED:', error.response?.data || error.message);
        process.exit(1);
    }
}

testValidPalindrome();
