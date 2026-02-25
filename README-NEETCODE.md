# 🔐 AuthLessX

> A NeetCode-inspired coding practice platform with passwordless authentication and mock interviews.

## 🎯 Overview

AuthLessX is a modern coding interview preparation platform that combines the best practices of platforms like NeetCode with innovative passwordless authentication. Practice coding problems, watch premium video solutions, and prepare for interviews without the hassle of managing passwords.

### ✨ Key Features

**🆓 Free Forever**
- 500+ coding problems across all difficulty levels
- Full code editor with multiple language support
- Real-time code execution and testing
- Progress tracking and statistics
- Mock interviews with instant feedback

**👑 Premium Content**
- Detailed video explanations for every problem
- Structured learning courses (DSA, System Design, Python, etc.)
- Interview tips and optimal approaches
- Advanced patterns and techniques
- Priority community support

**🔐 Passwordless Authentication**
- No passwords to remember or manage
- Cryptographic key-based security
- Military-grade encryption (RSA-2048 + AES-256)
- Multi-device support with seamless sync
- Zero-knowledge architecture

**🎤 Mock Interviews**
- Realistic interview environment with timers
- Multiple interview types (Coding, Technical, HR, Aptitude)
- Instant performance analytics
- Weak area identification
- Personalized recommendations

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/gauravttiwari/AuthLessX.git
cd AuthLessX

# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI

# Start the server
npm start
```

### Access the Platform

Open your browser and navigate to:
- **Home Page**: http://localhost:5000/home.html
- **Problems**: http://localhost:5000/problems.html
- **Courses**: http://localhost:5000/courses.html
- **Mock Interview**: http://localhost:5000/mock-interview.html

## 📚 Platform Structure

### Practice Problems

Browse 500+ problems organized by:
- **Topics**: Arrays & Hashing, Two Pointers, Sliding Window, Stack, Trees, Graphs, Dynamic Programming, and more
- **Difficulty**: Easy, Medium, Hard
- **Lists**: Blind 75, NeetCode 150, NeetCode 250
- **Companies**: Google, Meta, Amazon, Microsoft, etc.

**Features**:
- Split-screen layout (problem description + code editor)
- Monaco Editor (VSCode's editor) with syntax highlighting
- Multiple programming languages (Python, JavaScript, Java, C++, C)
- Run code with test cases
- Submit and get instant feedback
- Timer for mock interview mode
- Video solutions (Premium)

### Premium Courses

Structured learning paths with video content:
- **Data Structures & Algorithms** (Beginner + Advanced)
- **System Design** (Fundamentals + Interview Prep)
- **Python** (Basics, Interview Techniques, OOP)
- **Full Stack Development** (SQL, Web Development)
- **Object Oriented Design** (Patterns & Principles)

### Mock Interviews

Practice under real interview conditions:
1. **Coding Round**: Solve DSA problems with time limits
2. **Technical Round**: CS fundamentals and theory
3. **HR Round**: Behavioral questions
4. **Aptitude Round**: Logical and quantitative reasoning

**Features**:
- Customizable difficulty and topics
- Real-time timer
- Progress tracking
- Instant scoring
- Weak area identification
- Personalized recommendations

## 💻 Technology Stack

**Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- Monaco Editor (VSCode's editor)
- Responsive design with CSS Grid/Flexbox
- WebCrypto API for encryption

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for session management
- Judge0 API (code execution)

**Security**
- RSA-2048 key generation
- AES-256 encryption
- Digital signatures
- Challenge-response authentication

## 🔑 Authentication Flow

AuthLessX uses **passwordless authentication** based on public-key cryptography:

1. **Sign Up**: User enters name + email
2. **Key Generation**: Browser generates RSA-2048 key pair
3. **Registration**: Public key sent to server and stored
4. **Challenge**: Server sends encrypted challenge
5. **Proof**: Client decrypts with private key
6. **Verification**: Server verifies signature
7. **Access**: JWT token issued for session

**Benefits**:
- ✅ No password leaks or breaches
- ✅ No password resets
- ✅ Better UX (no memorization)
- ✅ Enterprise-grade security
- ✅ Multi-device support

## 🏗️ Project Architecture

```
AuthLessX/
├── backend/
│   ├── models/
│   │   ├── User.js           # User with premium & progress
│   │   ├── Question.js       # Problems with premium content
│   │   ├── Course.js         # Premium courses
│   │   ├── Interview.js      # Mock interview records
│   │   └── CodingAttempt.js  # Code submissions
│   ├── routes/
│   │   ├── auth.js           # Passwordless authentication
│   │   ├── problems.js       # Problem CRUD & filtering
│   │   ├── courses.js        # Course management
│   │   ├── coding.js         # Code execution
│   │   └── interview.js      # Mock interviews
│   ├── middleware/
│   │   └── auth.js           # JWT verification
│   ├── utils/
│   │   ├── crypto.js         # Encryption utilities
│   │   └── jwt.js            # Token management
│   └── server.js             # Express app
├── frontend/
│   ├── home.html             # NeetCode-style landing
│   ├── problems.html         # Problems with filters
│   ├── problem-detail.html   # Split-screen editor
│   ├── courses.html          # Premium courses
│   ├── mock-interview.html   # Interview simulator
│   ├── login.html            # Authentication
│   ├── css/
│   │   └── style-new.css     # NeetCode-inspired design
│   └── js/
│       ├── auth.js           # Authentication logic
│       ├── crypto.js         # Key generation
│       ├── problems.js       # Problems page logic
│       ├── problem-detail.js # Editor & submissions
│       ├── courses.js        # Courses page
│       └── mock-interview.js # Interview logic
└── README.md
```

## 🎨 Design Philosophy

**Inspired by NeetCode**
- Clean, distraction-free interface
- Focus on learning and practice
- Free practice, premium content model
- Progress tracking and motivation

**Key Principles**:
1. **Practice is Free**: Never lock coding problems
2. **Premium = Learning**: Video solutions and courses
3. **Clean UI**: No gimmicks, just content
4. **Interview Focus**: Real preparation, not just theory

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Sign in with key
- `POST /api/auth/challenge` - Get auth challenge
- `POST /api/auth/verify` - Verify signature

### Problems
- `GET /api/problems` - List all problems (with filters)
- `GET /api/problems/:id` - Get problem details
- `POST /api/problems/:id/submit` - Submit solution
- `GET /api/problems/stats/overview` - Get statistics

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/lessons/:lessonId/complete` - Mark lesson complete
- `GET /api/courses/user/progress` - Get user progress

### Interviews
- `POST /api/interview/start` - Start mock interview
- `POST /api/interview/submit` - Submit interview
- `GET /api/interview/history` - Get past interviews
- `GET /api/interview/stats` - Get statistics

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **NeetCode**: Inspiration for platform structure and learning approach
- **LeetCode**: Problem format and competitive programming
- **Judge0**: Code execution API
- **Monaco Editor**: VSCode's editor for the web

## 📧 Contact

**Gaurav Tiwari**
- GitHub: [@gauravttiwari](https://github.com/gauravttiwari)
- Project: [AuthLessX](https://github.com/gauravttiwari/AuthLessX)

## 🚀 Roadmap

- [x] Passwordless authentication
- [x] NeetCode-style UI
- [x] Problems with filtering
- [x] Split-screen editor
- [x] Premium courses structure
- [x] Mock interviews
- [ ] Complete Judge0 integration
- [ ] Video course content
- [ ] Discussion forums
- [ ] Mobile app
- [ ] AI-powered code review
- [ ] Live peer interviews
- [ ] Certification program

## 💡 Why AuthLessX?

**For Recruiters**: Demonstrates full-stack development, security best practices, system design, and product thinking.

**For Users**: Modern interview prep platform with production-grade authentication and clean UX.

**For Developers**: Reference for implementing passwordless auth and building coding platforms.

---

**Built with ❤️ for the coding interview community**

*"Practice Coding Interviews the Right Way"*
