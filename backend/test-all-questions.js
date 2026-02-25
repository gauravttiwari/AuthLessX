const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Test cases for multiple questions
const testQuestions = [
    {
        id: 1,
        name: 'Two Sum',
        language: 'python',
        code: `def twoSum(nums, target):
    seen = {}
    for i in range(len(nums)):
        complement = target - nums[i]
        if complement in seen:
            return [seen[complement], i]
        seen[nums[i]] = i
    return []`
    },
    {
        id: 125,
        name: 'Valid Palindrome',
        language: 'python',
        code: `def isPalindrome(s):
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    return cleaned == cleaned[::-1]`
    },
    {
        id: 20,
        name: 'Valid Parentheses',
        language: 'python',
        code: `def isValid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    return len(stack) == 0`
    },
    {
        id: 704,
        name: 'Binary Search',
        language: 'python',
        code: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
    },
    {
        id: 121,
        name: 'Best Time to Buy and Sell Stock',
        language: 'python',
        code: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return max_profit`
    },
    {
        id: 217,
        name: 'Contains Duplicate',
        language: 'python',
        code: `def containsDuplicate(nums):
    return len(nums) != len(set(nums))`
    },
    {
        id: 242,
        name: 'Valid Anagram',
        language: 'python',
        code: `def isAnagram(s, t):
    if len(s) != len(t):
        return False
    char_count = {}
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1
    for char in t:
        if char not in char_count:
            return False
        char_count[char] -= 1
        if char_count[char] < 0:
            return False
    return True`
    }
];

async function testAllQuestions() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Create test user
        const testUsername = `test_all_${Date.now()}`;
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

        console.log('🧪 Testing multiple questions...\n');
        console.log('='.repeat(80));

        let totalTests = 0;
        let passedTests = 0;
        let failedTests = 0;

        for (const question of testQuestions) {
            console.log(`\n📝 Testing: ${question.name} (ID: ${question.id})`);
            console.log('-'.repeat(80));

            try {
                const response = await axios.post('http://localhost:5000/api/coding/submit', {
                    questionId: question.id.toString(),
                    language: question.language,
                    code: question.code,
                    timeTaken: 120
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = response.data;
                totalTests++;

                console.log(`Status: ${result.data.status}`);
                console.log(`Score: ${result.data.score}/100`);
                console.log(`Test Cases: ${result.data.testCasesPassed}/${result.data.totalTestCases}`);

                if (result.data.status === 'Correct' || result.data.testCasesPassed === result.data.totalTestCases) {
                    console.log('✅ PASSED - All test cases passed!');
                    passedTests++;
                } else {
                    console.log(`⚠️  PARTIAL - ${result.data.testCasesPassed}/${result.data.totalTestCases} tests passed`);
                    failedTests++;
                    
                    // Show failed test cases
                    result.data.testResults.forEach((test, index) => {
                        if (!test.passed) {
                            console.log(`\n  ❌ Test Case ${index + 1} Failed:`);
                            console.log(`     Input: ${test.input}`);
                            console.log(`     Expected: ${test.expectedOutput}`);
                            console.log(`     Actual: ${test.actualOutput}`);
                            if (test.error) {
                                console.log(`     Error: ${test.error}`);
                            }
                        }
                    });
                }

            } catch (error) {
                console.log('❌ FAILED - Error during submission');
                console.log(`Error: ${error.response?.data?.message || error.message}`);
                totalTests++;
                failedTests++;
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('📊 FINAL RESULTS:');
        console.log('='.repeat(80));
        console.log(`Total Questions Tested: ${totalTests}`);
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
        console.log('='.repeat(80));

        if (failedTests === 0) {
            console.log('\n🎉 ALL QUESTIONS WORKING PERFECTLY! 🎉\n');
        } else {
            console.log(`\n⚠️  ${failedTests} question(s) need attention.\n`);
        }

        // Cleanup
        await User.deleteOne({ email: testEmail });
        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ TEST SUITE FAILED:', error.message);
        process.exit(1);
    }
}

testAllQuestions();
