# 🔐 AuthLessX - Integration Guide for Other Projects

## 📦 Quick Integration Guide

इस passwordless authentication system को अपने किसी भी Node.js/Express project में integrate करने के लिए ये steps follow करें।

---

## 🎯 Step 1: Copy Required Files

### Backend Files (Copy करें):

```
your-project/
├── backend/
│   ├── middleware/
│   │   └── auth.js          ← Copy from AuthLessX
│   ├── routes/
│   │   └── auth.js          ← Copy from AuthLessX
│   ├── utils/
│   │   ├── crypto.js        ← Copy from AuthLessX
│   │   └── jwt.js           ← Copy from AuthLessX
│   └── models/
│       └── User.js          ← Copy from AuthLessX (or modify existing)
```

### Frontend Files (Copy करें):

```
your-project/
├── frontend/
│   └── js/
│       ├── auth.js          ← Copy from AuthLessX
│       └── crypto.js        ← Copy from AuthLessX
```

---

## 🔧 Step 2: Install Dependencies

```bash
cd backend
npm install express mongoose jsonwebtoken dotenv cors
```

---

## ⚙️ Step 3: Environment Setup

`.env` file बनाएं और ये variables add करें:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Secret (secure random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Server Port
PORT=3000
```

**Important:** Production में strong JWT_SECRET use करें:
```bash
# Generate करने के लिए:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚀 Step 4: Backend Integration

### 4.1 Server Setup (server.js या app.js में)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Auth Routes (Passwordless Authentication)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Your Other Routes
const yourRoutes = require('./routes/your-routes');
app.use('/api/your-endpoint', yourRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
```

### 4.2 Protect Your Routes

अपने existing routes को protect करने के लिए:

```javascript
const { authenticateToken } = require('../middleware/auth');

// Protected Route Example
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        // req.user में userId और email available है
        console.log('Authenticated User:', req.user);
        
        res.json({
            success: true,
            user: req.user,
            data: {
                // Your protected data
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Public Route (No authentication needed)
router.get('/public-data', async (req, res) => {
    res.json({ success: true, data: 'Public information' });
});
```

---

## 🎨 Step 5: Frontend Integration

### 5.1 HTML में Scripts Include करें

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your App</title>
</head>
<body>
    <div id="auth-container">
        <!-- Login Form -->
        <div id="login-form">
            <h2>Login</h2>
            <input type="email" id="login-email" placeholder="Email">
            <button onclick="handleLogin()">Login</button>
        </div>

        <!-- Signup Form -->
        <div id="signup-form">
            <h2>Sign Up</h2>
            <input type="text" id="signup-name" placeholder="Name">
            <input type="email" id="signup-email" placeholder="Email">
            <button onclick="handleSignup()">Sign Up</button>
        </div>
    </div>

    <!-- Scripts -->
    <script src="js/crypto.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/your-app.js"></script>
</body>
</html>
```

### 5.2 Authentication Functions Use करें

```javascript
// your-app.js

const API_URL = 'http://localhost:3000/api';

// Signup Handler
async function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    
    if (!name || !email) {
        alert('Please fill all fields');
        return;
    }

    try {
        const result = await signup(name, email);
        console.log('Signup successful:', result);
        
        // Auto login after signup
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Signup failed: ' + error.message);
    }
}

// Login Handler
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    
    if (!email) {
        alert('Please enter email');
        return;
    }

    try {
        const result = await login(email);
        console.log('Login successful:', result);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Logout Function
function logout() {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
}

// Make API Call with Authentication
async function fetchProtectedData() {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_URL}/your-endpoint/data`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (response.status === 401) {
        // Token expired or invalid
        logout();
        return;
    }
    
    const data = await response.json();
    return data;
}
```

---

## 🔒 Step 6: User Model (अगर आपका existing User model है)

अगर आपके पास पहले से User model है, तो इसे modify करें:

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    // Passwordless Auth: Public Keys for multiple devices
    publicKeys: [{
        key: {
            type: String,
            required: true
        },
        deviceInfo: {
            type: String,
            default: 'Unknown Device'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        lastUsed: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Your existing fields
    // role: String,
    // profile: Object,
    // etc...
    
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

---

## 📱 Step 7: API Endpoints Available

Integration के बाद ये endpoints available होंगे:

### Public Endpoints (No Auth Required):

```
POST /api/auth/signup
Body: { name, email, publicKey, deviceInfo }
Response: { success, message, data: { userId, name, email } }

POST /api/auth/request-challenge
Body: { email }
Response: { success, challengeId, challenge }

POST /api/auth/verify-challenge
Body: { challengeId, signature }
Response: { success, token, user: { userId, name, email } }
```

### Protected Endpoints (Auth Required):

```
// Your custom endpoints with authenticateToken middleware
GET /api/your-endpoint/data
Headers: { Authorization: "Bearer <token>" }
```

---

## 🧪 Step 8: Testing

### Test Backend:

```bash
# Start server
cd backend
npm start

# Test signup endpoint
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","publicKey":"..."}'
```

### Test Frontend:

1. Open `index.html` in browser
2. Try signup → key generate hogi
3. Try login → challenge-response होगा
4. Check localStorage में token
5. Access protected pages

---

## 🎯 Common Use Cases

### Use Case 1: E-commerce Website

```javascript
// Product Routes (Protected)
router.get('/my-orders', authenticateToken, async (req, res) => {
    const orders = await Order.find({ userId: req.user.userId });
    res.json({ success: true, orders });
});

router.post('/checkout', authenticateToken, async (req, res) => {
    const order = new Order({
        userId: req.user.userId,
        items: req.body.items,
        total: req.body.total
    });
    await order.save();
    res.json({ success: true, order });
});
```

### Use Case 2: Social Media App

```javascript
// Post Routes (Protected)
router.post('/create-post', authenticateToken, async (req, res) => {
    const post = new Post({
        userId: req.user.userId,
        content: req.body.content,
        createdAt: new Date()
    });
    await post.save();
    res.json({ success: true, post });
});
```

### Use Case 3: Dashboard/Admin Panel

```javascript
// Admin Routes (Protected + Role Check)
router.get('/admin/users', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId);
    
    if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const users = await User.find({});
    res.json({ success: true, users });
});
```

---

## 🔐 Security Best Practices

1. **Always use HTTPS in production** - Private keys secure रहें
2. **JWT_SECRET strong रखें** - Minimum 32 characters
3. **Token expiry set करें** - Default 7 days है
4. **CORS properly configure करें**:
   ```javascript
   app.use(cors({
       origin: 'https://your-domain.com',
       credentials: true
   }));
   ```
5. **Rate limiting add करें** - Brute force attacks से बचने के लिए

---

## 🐛 Troubleshooting

### Problem: "Keys not found in IndexedDB"
**Solution:** Browser में IndexedDB support check करें, incognito mode में काम नहीं करेगा

### Problem: "Invalid signature"
**Solution:** Public key और private key match करने चाहिए, re-signup करें

### Problem: "Token expired"
**Solution:** Login again करें, token 7 days valid है

### Problem: "CORS error"
**Solution:** Backend में CORS properly configure करें

---

## 📚 Additional Resources

- [Web Crypto API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [JWT Best Practices](https://jwt.io/introduction)
- [RSA Encryption Guide](https://en.wikipedia.org/wiki/RSA_(cryptosystem))

---

## 🎉 Integration Complete!

अब आपका project passwordless authentication के साथ ready है! 🚀

### Next Steps:
- ✅ Test all endpoints
- ✅ Add error handling
- ✅ Customize UI/UX
- ✅ Deploy to production
- ✅ Monitor authentication logs

---

## 💡 Pro Tips

1. **Multi-device support**: Users multiple devices से login कर सकते हैं
2. **Device management**: User dashboard में device list दिखाएं
3. **Biometric integration**: WebAuthn API से combine कर सकते हैं
4. **Session management**: Refresh tokens implement करें
5. **Activity logs**: Login history track करें

---

**Need Help?** Check the full source code in AuthLessX repository for reference implementation! 🔥
