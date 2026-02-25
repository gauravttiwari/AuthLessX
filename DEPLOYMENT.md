# 🚀 Quick Deployment Guide

## Step 1: Update HTML Files to Use New CSS

All new HTML files need to use `style-new.css` instead of `style.css`.

Update the following files:

### home.html
```html
<link rel="stylesheet" href="css/style-new.css">
```

### problems.html
```html
<link rel="stylesheet" href="css/style-new.css">
```

### problem-detail.html
```html
<link rel="stylesheet" href="css/style-new.css">
```

### courses.html
```html
<link rel="stylesheet" href="css/style-new.css">
```

### mock-interview.html
```html
<link rel="stylesheet" href="css/style-new.css">
```

### login.html
```html
<link rel="stylesheet" href="css/style-new.css">
```

## Step 2: Update Entry Point

Change `index.html` to redirect to `home.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=home.html">
    <title>AuthLessX</title>
</head>
<body>
    <p>Redirecting to <a href="home.html">AuthLessX</a>...</p>
</body>
</html>
```

## Step 3: Start the Server

```bash
cd backend
npm start
```

## Step 4: Access the Platform

Open browser and go to:
- **Home**: http://localhost:5000/home.html
- **Problems**: http://localhost:5000/problems.html
- **Courses**: http://localhost:5000/courses.html
- **Mock Interview**: http://localhost:5000/mock-interview.html

## Step 5: Test Authentication

1. Click "Sign In" on home page
2. Go to "Sign Up" tab
3. Enter name and email
4. Keys will be generated automatically
5. You'll be redirected to dashboard

## Step 6: Seed Sample Data (Optional)

Create `backend/seed-problems.js`:

```javascript
const mongoose = require('mongoose');
const Question = require('./models/Question');

const sampleProblems = [
    {
        questionId: 'two-sum',
        type: 'DSA',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.',
        difficulty: 'Easy',
        topic: 'Arrays & Hashing',
        timeLimit: 30,
        examples: [
            {
                input: 'nums = [2,7,11,15], target = 9',
                output: '[0,1]',
                explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1]'
            }
        ],
        constraints: '2 <= nums.length <= 10^4',
        hints: ['Use a hash map to store seen numbers'],
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        basicExplanation: 'Use a hash map to store complement values as you iterate',
        neetCodeLists: {
            blind75: true,
            neetCode150: true,
            neetCode250: true
        },
        acceptanceRate: 49.2,
        companies: ['Google', 'Amazon', 'Microsoft'],
        starterCode: {
            python: 'def twoSum(nums, target):\n    # Write your code here\n    pass',
            javascript: 'function twoSum(nums, target) {\n    // Write your code here\n}',
            java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}'
        },
        testCases: [
            { input: '[2,7,11,15]\\n9', expectedOutput: '[0,1]', isHidden: false },
            { input: '[3,2,4]\\n6', expectedOutput: '[1,2]', isHidden: false }
        ]
    },
    // Add more problems...
];

async function seed() {
    await mongoose.connect('mongodb://localhost:27017/authlessx');
    await Question.deleteMany({});
    await Question.insertMany(sampleProblems);
    console.log('✅ Seeded problems');
    process.exit(0);
}

seed().catch(console.error);
```

Run: `node backend/seed-problems.js`

## Step 7: Optional - Deploy to Production

### Option 1: Heroku

```bash
# Install Heroku CLI
heroku login
heroku create authlessx

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

### Option 2: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel)**:
```bash
cd frontend
vercel
```

**Backend (Railway)**:
1. Go to railway.app
2. New Project → Deploy from GitHub
3. Add MongoDB plugin
4. Set environment variables

### Option 3: AWS EC2

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ip

# Install dependencies
sudo apt update
sudo apt install nodejs npm mongodb -y

# Clone and run
git clone your-repo
cd AuthLessX/backend
npm install
node server.js
```

## Step 8: Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use MongoDB Atlas (not local)
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up monitoring (PM2)
- [ ] Configure backup strategy
- [ ] Add error tracking (Sentry)
- [ ] Optimize images
- [ ] Enable caching
- [ ] Add CDN for static files

## Troubleshooting

### MongoDB Connection Failed
```bash
# Ensure MongoDB is running
sudo systemctl start mongodb
# OR use MongoDB Atlas connection string
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3000
```

### Problems Not Loading
```bash
# Check API endpoint
console.log('API_BASE:', API_BASE);
# Ensure CORS is enabled in server.js
app.use(cors());
```

### Monaco Editor Not Loading
```bash
# Check CDN link is correct
# Check browser console for errors
# Try different CDN if needed
```

## Next Steps

1. ✅ Test all pages
2. ✅ Test authentication flow
3. ✅ Test premium features (mock premium user)
4. ✅ Test mock interviews
5. ✅ Test mobile responsiveness
6. 📝 Create demo video
7. 🚀 Deploy to production
8. 📧 Share with recruiters!

---

**Need Help?** Check:
- Browser console for errors
- Backend logs for API issues
- MongoDB for data issues
- Network tab for failed requests

**Good Luck! 🎯**
