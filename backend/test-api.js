const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function testSubmission() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB\n');
        
        // Create or find test user
        console.log('👤 Creating/finding test user...');
        let user = await User.findOne({ email: 'test@testapi.com' });
        if (!user) {
            user = new User({
                name: 'Test User',
                email: 'test@testapi.com',
                publicKey: 'test-public-key'
            });
            await user.save();
            console.log('✅ Test user created');
        } else {
            console.log('✅ Test user found');
        }
        console.log('User ID:', user._id);
        console.log('');
        
        // Create a test token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        console.log('🔑 Token created:', token.substring(0, 30) + '...\n');
        
        console.log('📤 Sending submission request...');
        console.log('Question: Two Sum (ID: 1)');
        console.log('Language: Python');
        console.log('');
        
        const response = await axios.post('http://localhost:5000/api/coding/submit', {
            questionId: '1',  // Two Sum
            language: 'python',
            code: 'def twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []',
            timeTaken: 120
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ SUCCESS! Code submission working! ✅');
        console.log('Status:', response.status);
        console.log('\n📊 Response Data:');
        console.log(JSON.stringify(response.data, null, 2));
        
        mongoose.connection.close();
        
    } catch (error) {
        console.log('❌ ERROR! Code submission failed! ❌');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
            console.log('Stack:', error.stack);
        }
        
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    }
}

console.log('🧪 Testing Backend API Code Submission...\n');
testSubmission();
