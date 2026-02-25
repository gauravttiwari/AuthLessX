# 🚀 AuthLessX Full Project Setup Guide

This guide will help you set up the AuthLessX project from scratch (frontend + backend + database) for local development.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/gauravttiwari/AuthLessX.git
cd AuthLessX
```

---

## 2️⃣ Backend Setup

### a. Install Dependencies
```bash
cd backend
npm install
```

### b. Configure Environment Variables
- Copy `.env.example` to `.env` (or create `.env`):

```
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-random-secret>
```

- Example for local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/authlessx
JWT_SECRET=supersecretkey
```

### c. Seed the Database (Add All Questions)
```bash
node seed-all-questions.js
```

### d. Start Backend Server
```bash
node server.js
```
- Runs on: http://localhost:5000

---

## 3️⃣ Frontend Setup

### a. Install Dependencies
```bash
cd ../frontend
npm install
```

### b. Start Frontend Server
```bash
node server.js
```
- Runs on: http://localhost:3000

---

## 4️⃣ Quick Test (Login & Practice)
- Open: [http://localhost:3000/quick-login.html](http://localhost:3000/quick-login.html)
- Click "🚀 Quick Login" to generate a test user and token
- Click "Go to Practice Problems →" to start solving questions

---

## 5️⃣ Notes
- **Judge0 API** is used for code execution (no setup needed)
- All 59 Blind 75 questions are pre-seeded and free
- If you want to reset questions, re-run: `node seed-all-questions.js` in backend
- For any issues, check backend/frontend terminal logs

---

## 6️⃣ Troubleshooting
- **Port 5000/3000 already in use?**
    - Kill node processes: `npx kill-port 5000 3000` or restart your terminal
- **MongoDB not running?**
    - Start MongoDB locally or use MongoDB Atlas
- **Judge0 API down?**
    - Wait and retry, or check https://ce.judge0.com

---

## 7️⃣ Useful Scripts
- `backend/seed-all-questions.js` → Seed all questions
- `backend/test-all-questions.js` → Test all coding questions (dev only)

---

## 📦 Backend Dependencies

Install all backend dependencies with:
```bash
cd backend
npm install
```

This will install:
- axios
- cors
- crypto
- dotenv
- express
- jsonwebtoken
- mongoose
- node-rsa

**Dev dependencies:**
- nodemon

---

## 📦 Frontend Dependencies

Install all frontend dependencies with:
```bash
cd frontend
npm install
```

This will install:
- express

**Dev dependencies:**
- nodemon

---

# ✅ You're ready! Happy coding! 🚀
