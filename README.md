# 🔐 AuthLessX - Passwordless Mock Interview Platform

A secure, modern mock interview preparation platform using **Passwordless Authentication with Cryptography**.

## 🌟 Project Overview

AuthLessX eliminates traditional password-based authentication by implementing **cryptographic key pairs** (Public Key + Private Key) for user authentication. This approach provides enhanced security against phishing, password leaks, and brute-force attacks.

### Key Features

✅ **Passwordless Authentication** - No passwords stored anywhere
✅ **Cryptographic Security** - RSA-2048 key pair generation
✅ **Challenge-Response Protocol** - Server challenges, client signs
✅ **Mock Interview Platform** - Technical, HR, and Aptitude practice
✅ **Performance Tracking** - Score history and statistics
✅ **Real-time Feedback** - Instant results and improvement suggestions

---

## 🔒 How Passwordless Authentication Works

### Authentication Flow

```
1. SIGNUP
   ├── User enters Name & Email
   ├── Browser generates RSA Key Pair (2048-bit)
   ├── Public Key → Stored in MongoDB
   └── Private Key → Stored in Browser's IndexedDB

2. LOGIN
   ├── User enters Email
   ├── Server generates Random Challenge (Nonce)
   ├── Challenge sent to User
   ├── Browser signs Challenge with Private Key
   ├── Signed Response sent to Server
   ├── Server verifies Signature using Public Key
   └── If Valid → Access Granted (JWT Token issued)
```

### Security Benefits

🔐 **No Password Storage** - Nothing to leak or hack
🛡️ **Phishing Resistant** - Keys can't be easily stolen
🚫 **No Brute Force** - Cryptographic signatures can't be guessed
🔑 **Device-Based Security** - Private key never leaves device

---

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database for users & interview data
- **Mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT token generation
- **crypto** (Node.js) - Cryptographic operations

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with gradients & animations
- **JavaScript (ES6+)** - Logic
- **Web Crypto API** - Browser-based cryptography
- **IndexedDB** - Client-side private key storage

---

## 📁 Project Structure

```
AuthLessX/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (name, email, publicKey)
│   │   ├── Challenge.js     # Challenge schema (expires in 5 min)
│   │   └── Interview.js     # Interview results schema
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   └── interview.js     # Interview endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── utils/
│   │   ├── crypto.js        # Challenge generation & signature verification
│   │   └── jwt.js           # JWT token utilities
│   ├── server.js            # Express server setup
│   ├── package.json         # Dependencies
│   └── .env                 # Environment variables
│
└── frontend/
    ├── css/
    │   └── style.css        # Complete styling
    ├── js/
    │   ├── crypto.js        # RSA key generation & signing
    │   ├── auth.js          # Signup/Login logic
    │   └── dashboard.js     # Interview functionality
    ├── index.html           # Login/Signup page
    └── dashboard.html       # Mock interview dashboard
```

---

## 🚀 Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** (v4 or higher) - [Download](https://www.mongodb.com/try/download/community)

### Step 1: Clone/Navigate to Project

```bash
cd c:\Users\dell\OneDrive\Desktop\AuthLessX
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables

Edit `backend\.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/authlessx
JWT_SECRET=your_secure_random_secret_key_here
NODE_ENV=development
```

⚠️ **Important**: Change `JWT_SECRET` to a strong random string in production!

### Step 4: Start MongoDB

Open a new terminal and run:

```bash
mongod
```

Or if MongoDB is installed as a service:

```bash
net start MongoDB
```

### Step 5: Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
🔗 http://localhost:5000
```

### Step 6: Open Frontend

Open `frontend\index.html` in your browser, or use a live server:

```bash
# If you have Python installed
cd frontend
python -m http.server 8080
```

Then open: `http://localhost:8080`

---

## 📱 Using the Application

### 1. Signup

1. Enter your **Name** and **Email**
2. Click **Sign Up**
3. The browser automatically generates your cryptographic keys
4. Your **Public Key** is sent to the server
5. Your **Private Key** is securely stored in your browser

### 2. Login

1. Enter your **Email**
2. Click **Login**
3. Server sends a **Challenge**
4. Browser signs it with your **Private Key**
5. Server verifies the signature
6. If valid, you're logged in!

### 3. Mock Interviews

Choose from three categories:

- **💻 Technical Interview** - Programming & technical questions
- **👔 HR Interview** - Behavioral & soft skills
- **🧮 Aptitude Test** - Logical & mathematical problems

### 4. Track Performance

- View overall statistics
- Check category-wise scores
- Review interview history
- Get personalized feedback

---

## 🔑 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user with public key |
| POST | `/api/auth/login/challenge` | Request authentication challenge |
| POST | `/api/auth/login/verify` | Verify signature and login |
| GET | `/api/auth/check-email/:email` | Check if email exists |

### Interview (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/interview/questions/:category` | Get interview questions |
| POST | `/api/interview/submit` | Submit interview answers |
| GET | `/api/interview/history` | Get user's interview history |
| GET | `/api/interview/stats` | Get performance statistics |

---

## 🧪 Testing the System

### Test Signup Flow

1. Open browser DevTools (F12) → Application → IndexedDB
2. Sign up with test email: `test@example.com`
3. Check IndexedDB → `AuthLessXDB` → `keys` → You'll see your private key
4. Check MongoDB → `authlessx` → `users` → You'll see public key stored

### Test Login Flow

1. Open DevTools → Network tab
2. Enter email and click Login
3. Watch the network requests:
   - `POST /api/auth/login/challenge` → Server sends challenge
   - `POST /api/auth/login/verify` → Browser sends signature
4. Check Console → You'll see cryptographic operations
5. On success → JWT token stored in localStorage

---

## 🔐 Security Features

### Implemented

✅ RSA-2048 bit key pairs
✅ Challenge-response authentication
✅ Signature verification using public key
✅ JWT tokens with 7-day expiration
✅ Private keys never transmitted to server
✅ Challenges expire in 5 minutes
✅ CORS protection
✅ Input validation

### Recommended for Production

⚠️ Use HTTPS (TLS/SSL) for all communications
⚠️ Implement rate limiting on API endpoints
⚠️ Add CSRF protection
⚠️ Use WebAuthn for hardware security key support
⚠️ Implement key rotation mechanism
⚠️ Add backup authentication method
⚠️ Use environment-specific JWT secrets

---

## 📊 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  publicKey: String (PEM format),
  createdAt: Date,
  lastLogin: Date
}
```

### Challenge Collection

```javascript
{
  _id: ObjectId,
  email: String,
  challenge: String (base64),
  createdAt: Date,
  expires: 300 seconds // Auto-delete after 5 minutes
}
```

### Interview Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  category: String (technical/hr/aptitude),
  score: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  timeTaken: Number (seconds),
  feedback: String,
  completedAt: Date
}
```

---

## 🎓 Project Highlights for Viva/Presentation

### Why This Project is Unique

1. **Industry-Relevant** - Implements real-world cryptography concepts
2. **No Passwords** - Eliminates password-related vulnerabilities
3. **Modern Security** - Uses RSA-2048 and challenge-response protocol
4. **Practical Application** - Mock interview platform for skill development
5. **Full-Stack** - Covers frontend, backend, database, and security

### Key Technical Concepts

- **Public Key Cryptography** - Asymmetric encryption
- **Digital Signatures** - Authenticity verification
- **Challenge-Response** - Protection against replay attacks
- **JWT Tokens** - Stateless session management
- **IndexedDB** - Browser-based secure storage
- **Web Crypto API** - Browser-native cryptography

### Real-World Inspiration

This project is inspired by:
- **Passkeys** (FIDO2/WebAuthn standard)
- **GitHub SSH Keys**
- **Cryptocurrency Wallets**
- **Apple's Face ID / Touch ID**

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```bash
# Start MongoDB service
net start MongoDB

# Or run mongod manually
mongod --dbpath="C:\data\db"
```

### CORS Error

Make sure backend is running on `http://localhost:5000`
Frontend should access the same origin or CORS should be enabled

### Private Key Not Found

- User must use the same browser/device they signed up with
- Private key is stored in browser's IndexedDB
- Clear browser data will delete the key
- Implement key export/import feature for recovery

### Port Already in Use

```bash
# Change PORT in .env file or kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📚 Learning Resources

- [Web Crypto API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [RSA Cryptography Explained](https://en.wikipedia.org/wiki/RSA_(cryptosystem))
- [JWT Introduction](https://jwt.io/introduction)
- [WebAuthn Guide](https://webauthn.guide/)

---

## 🤝 Contributing

This is an educational project. Feel free to:
- Add more interview questions
- Implement additional features
- Improve security measures
- Enhance UI/UX

---

## 📝 License

This project is for educational purposes. Free to use and modify.

---

## 👨‍💻 Developer

Created as a final year project demonstrating:
- Advanced Authentication Mechanisms
- Cryptographic Implementations
- Full-Stack Development
- Security Best Practices

---

## 🎯 Future Enhancements

- [ ] WebAuthn integration for hardware keys
- [ ] Video interview practice with AI feedback
- [ ] Multi-device key sync
- [ ] Social authentication backup
- [ ] Mobile app (React Native)
- [ ] Real-time peer interviews
- [ ] AI-powered question generation
- [ ] Resume analysis and matching

---

**Made with ❤️ for Secure Authentication**
