# Quick Setup Guide for AuthLessX

## Step-by-Step Setup (5 Minutes)

### 1. Install Node.js
Download and install from: https://nodejs.org/
Verify: `node --version` and `npm --version`

### 2. Install MongoDB
Download from: https://www.mongodb.com/try/download/community
Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

This installs:
- express (web framework)
- mongoose (MongoDB driver)
- jsonwebtoken (JWT tokens)
- cors (CORS handling)
- dotenv (environment variables)
- crypto (cryptography)

### 4. Configure Backend
Edit `backend\.env` and set:
- PORT=5000
- MONGODB_URI=mongodb://localhost:27017/authlessx
- JWT_SECRET=create_your_own_random_secret_key

### 5. Start MongoDB
```bash
# Windows
net start MongoDB

# Or manually
mongod
```

### 6. Start Backend Server
```bash
cd backend
npm start
```

Expected output:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### 7. Open Frontend
Double-click: `frontend\index.html`

Or use a live server:
```bash
cd frontend
python -m http.server 8080
# Then open: http://localhost:8080
```

### 8. Test the System

**Signup:**
1. Enter name: Test User
2. Enter email: test@example.com
3. Click "Sign Up"
4. Keys are generated automatically!

**Login:**
1. Enter email: test@example.com
2. Click "Login"
3. Challenge-response authentication happens
4. Redirected to dashboard!

**Mock Interview:**
1. Choose a category (Technical/HR/Aptitude)
2. Answer questions
3. Submit and view results!

## Troubleshooting

### Issue: MongoDB connection failed
**Solution:** Make sure MongoDB is running
```bash
net start MongoDB
```

### Issue: Port 5000 already in use
**Solution:** Change PORT in .env file or kill the process
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: CORS error
**Solution:** Make sure backend is running and frontend URL is correct

### Issue: Private key not found during login
**Solution:** 
- You must use the same browser you signed up with
- Private key is stored in browser's IndexedDB
- If you cleared browser data, you need to signup again

## Project Demo Flow (For Viva)

1. **Show Login Page** - Explain passwordless concept
2. **Open DevTools** - Show IndexedDB and Network tab
3. **Signup** - Watch key generation in console
4. **Check Database** - Show public key stored in MongoDB
5. **Check IndexedDB** - Show private key stored locally
6. **Login** - Demonstrate challenge-response in Network tab
7. **Mock Interview** - Take a sample interview
8. **View Results** - Show scoring and feedback
9. **Statistics** - Display performance tracking

## Code Walkthrough for Viva

### Backend Files to Explain:
1. `server.js` - Express setup
2. `models/User.js` - Database schema
3. `routes/auth.js` - Authentication endpoints
4. `utils/crypto.js` - Signature verification
5. `middleware/auth.js` - JWT protection

### Frontend Files to Explain:
1. `js/crypto.js` - RSA key generation
2. `js/auth.js` - Signup/Login flow
3. `js/dashboard.js` - Interview logic

## Key Points to Mention

✅ No password storage anywhere
✅ Public key in database, private key in browser
✅ Challenge-response prevents replay attacks
✅ RSA-2048 bit encryption
✅ JWT tokens for session management
✅ Real-world application (like Passkeys/WebAuthn)

## Done! 🎉

Your passwordless authentication system is now running!

Access:
- Frontend: http://localhost:8080 or open index.html
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

Enjoy your secure mock interview platform!
