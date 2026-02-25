const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function testValidPalindrome() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB\n');
        
        // Find test user
        let user = await User.findOne({ email: 'test@testapi.com' });
        if (!user) {
            console.log('❌ Test user not found. Run test-api.js first.');
            mongoose.connection.close();
            return;
        }
        
        // Create token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        console.log('🧪 Testing Valid Palindrome (ID: 125)');
        console.log('Language: Python\n');
        
        const response = await axios.post('http://localhost:5000/api/coding/submit', {
            questionId: '125',
            language: 'python',
            code: `def isPalindrome(s):
    # Remove non-alphanumeric and convert to lowercase
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]`,
            timeTaken: 60
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ SUCCESS! ✅');
        console.log('Status:', response.status);
        console.log('\n📊 Response Data:');
        console.log(JSON.stringify(response.data, null, 2));
        
        mongoose.connection.close();
        
    } catch (error) {
        console.log('❌ ERROR! ❌');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
        
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    }
}

testValidPalindrome();
