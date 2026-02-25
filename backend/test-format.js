const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testFormatFix() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create test user
        const testUsername = `test_format_${Date.now()}`;
        const testEmail = `${testUsername}@test.com`;

        let user = await User.findOne({ email: testEmail });
        if (!user) {
            user = new User({
                name: testUsername,
                email: testEmail,
                publicKey: 'test-public-key'
            });
            await user.save();
            console.log('✅ Test user created');
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log('✅ Token created');

        // Test Two Sum with correct format
        const twoSumCode = `def twoSum(nums, target):
    seen = {}
    for i in range(len(nums)):
        complement = target - nums[i]
        if complement in seen:
            return [seen[complement], i]
        seen[nums[i]] = i
    return []`;

        console.log('\n🧪 Testing Two Sum (Question ID: 1)...');
        const response = await axios.post('http://localhost:5000/api/coding/submit', {
            questionId: 1,
            language: 'python',
            code: twoSumCode,
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
        console.log('\n📝 Test Results:');
        
        result.data.testResults.forEach((test, index) => {
            console.log(`\nTest Case ${index + 1}:`);
            console.log('  Input:', test.input);
            console.log('  Expected:', test.expectedOutput);
            console.log('  Actual:', test.actualOutput);
            console.log('  Status:', test.passed ? '✅ PASSED' : '❌ FAILED');
            if (test.error) {
                console.log('  Error:', test.error);
            }
        });

        console.log('\n🎉 Test completed!');
        
        // Cleanup
        await User.deleteOne({ email: testEmail });
        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ TEST FAILED:', error.response?.data || error.message);
        process.exit(1);
    }
}

testFormatFix();
