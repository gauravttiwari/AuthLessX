
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │
│  │   HTML5  │  │   CSS3   │  │  Vanilla JavaScript      │  │
│  │  Pages   │  │  Styling │  │  + Monaco Editor (VS Code)│ │
│  └──────────┘  └──────────┘  └──────────────────────────┘  │
│                                                             │
│  Authentication: WebCrypto API + IndexedDB (Private Keys)  │
└─────────────────────────────────────────────────────────────┘
                              ▼
                    REST APIs (JWT Auth)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
│  ┌──────────────────┐  ┌──────────────────────────────┐    │
│  │  Node.js +       │  │   Security Layer             │    │
│  │  Express.js      │  │   - JWT Tokens               │    │
│  │                  │  │   - Challenge-Response       │    │
│  │  API Routes:     │  │   - Signature Verification   │    │
│  │  • /auth         │  └──────────────────────────────┘    │
│  │  • /interview    │                                       │
│  │  • /coding       │  ┌──────────────────────────────┐    │
│  └──────────────────┘  │   Code Execution Engine      │    │
│                        │   - Test Case Runner         │    │
│                        │   - Score Calculator         │    │
│                        └──────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                      │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐     │
│  │   Users    │  │  Questions  │  │  CodingAttempts  │     │
│  │ (Multi-    │  │  (DSA +     │  │  (Submissions +  │     │
│  │  Device)   │  │   Programs) │  │   Scores)        │     │
│  └────────────┘  └─────────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Key Features

**🔑 Passwordless Auth**
- RSA key pair generation (WebCrypto API)
- Private keys stored locally (never sent to server)
- Challenge-response authentication
- Multi-device support (add multiple devices per account)

**💼 Mock Interviews**
- Technical, HR, Aptitude rounds
- MCQ-based questions
- Real-time timer & scoring
- Performance analytics

**💻 Coding Platform**
- Monaco Editor integration (VS Code experience)
- 5 languages: C, C++, Java, Python, JavaScript
- DSA & Programming categories
- Test case execution & validation
- Automated scoring with time bonus

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript, Monaco Editor
**Backend:** Node.js, Express.js, Mongoose
**Database:** MongoDB
**Security:** JWT, RSA-2048, WebCrypto API
**Code Execution:** Judge0 API (prepared)

## 📊 Data Flow

1. **Signup:** Generate keys → Store private key locally → Send public key to server
2. **Login:** Server sends challenge → Sign with private key → Server verifies → JWT token
3. **Coding:** Write code in Monaco → Submit → Run test cases → Calculate score → Save attempt

## 🎯 Why This Matters

- **Zero passwords** = Zero password breaches
- **Cryptographic security** = Military-grade protection
- **Complete platform** = Interview prep + coding practice in one place
- **Production-ready** = JWT auth, proper error handling, scalable architecture

## 📈 Statistics

- **35 files** | **7,500+ lines of code**
- **REST APIs:** 15+ endpoints
- **Authentication:** 100% passwordless
- **Multi-device:** Unlimited devices per user

---

🔗 **GitHub:** https://github.com/gauravttiwari/AuthLessX
🏷️ **Tags:** #WebDevelopment #Cryptography #JavaScript #NodeJS #MongoDB #PasswordlessAuth #CodingPlatform #WebSecurity

---

💡 **Learnings:**
- Implementing challenge-response authentication from scratch
- Integrating Monaco Editor for professional code editing
- Designing secure multi-device authentication
- Building real-time code execution & scoring systems

**Open for feedback and collaboration!** 🤝
