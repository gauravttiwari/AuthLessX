const axios = require('axios');

// Test the submit endpoint
async function testSubmit() {
    try {
        console.log('Testing /api/coding/submit endpoint...\n');
        
        // Replace with a valid token from your login
        const token = 'YOUR_TOKEN_HERE';
        
        const response = await axios.post('http://localhost:5000/api/coding/submit', {
            questionId: 'two-sum',
            language: 'python',
            code: 'def twoSum(nums, target):\n    return [0, 1]',
            timeTaken: 60
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✓ Success!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('✗ Error occurred:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Response:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testSubmit();
