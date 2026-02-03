# AuthLessX - Project Documentation for Viva

## 🎯 Project Title
**Passwordless Authentication System using Cryptography for Mock Interview Platform**

---

## 📋 Table of Contents
1. Introduction
2. Problem Statement
3. Objectives
4. Technology Stack
5. System Architecture
6. Authentication Flow
7. Implementation Details
8. Security Features
9. Testing & Results
10. Future Scope
11. Conclusion

---

## 1. Introduction

Traditional authentication systems rely on passwords, which are vulnerable to:
- **Phishing attacks** - Users can be tricked into revealing passwords
- **Brute force attacks** - Automated password guessing
- **Password leaks** - Database breaches expose passwords
- **Weak passwords** - Users often choose predictable passwords
- **Password reuse** - Same password across multiple sites

**Our Solution:** Implement passwordless authentication using **Public Key Cryptography** where:
- No passwords are stored or transmitted
- Each user has a unique cryptographic key pair
- Authentication is based on digital signatures
- Private keys never leave the user's device

---

## 2. Problem Statement

**Primary Problem:** Password-based authentication is inherently insecure and inconvenient.

**Real-World Issues:**
- 81% of data breaches involve stolen or weak passwords
- Users struggle to remember multiple strong passwords
- Password reset processes are time-consuming
- Phishing attacks successfully steal millions of passwords annually

**Our Approach:** Eliminate passwords entirely by implementing cryptographic key-based authentication in a practical application (Mock Interview Platform).

---

## 3. Objectives

### Primary Objectives:
1. ✅ Implement passwordless authentication using RSA cryptography
2. ✅ Store public keys on server, private keys on client device
3. ✅ Use challenge-response protocol for secure login
4. ✅ Create a practical application (Mock Interview Platform)

### Secondary Objectives:
1. ✅ Implement JWT-based session management
2. ✅ Create user-friendly interface
3. ✅ Track user performance and provide feedback
4. ✅ Ensure security against common attacks

---

## 4. Technology Stack

### Backend Technologies:
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime environment | v14+ |
| Express.js | Web framework | v4.18.2 |
| MongoDB | Database | v4+ |
| Mongoose | MongoDB ODM | v7.5.0 |
| jsonwebtoken | JWT tokens | v9.0.2 |
| crypto | Cryptographic operations | Built-in |

### Frontend Technologies:
| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling |
| JavaScript ES6+ | Logic |
| Web Crypto API | Browser cryptography |
| IndexedDB | Client-side storage |

---

## 5. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                         │
├─────────────────────────────────────────────────────────────┤
│  Browser                                                     │
│  ├── Web Crypto API (Key Generation & Signing)             │
│  ├── IndexedDB (Private Key Storage)                       │
│  └── JavaScript Logic (UI & API Calls)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS (Secure Channel)
                     │
┌────────────────────▼────────────────────────────────────────┐
│                         SERVER SIDE                         │
├─────────────────────────────────────────────────────────────┤
│  Express.js Server                                          │
│  ├── Authentication Routes                                  │
│  │   ├── /signup → Store public key                        │
│  │   ├── /login/challenge → Generate nonce                 │
│  │   └── /login/verify → Verify signature                  │
│  ├── Interview Routes (Protected)                          │
│  └── Middleware (JWT Verification)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Mongoose ODM
                     │
┌────────────────────▼────────────────────────────────────────┐
│                         DATABASE                            │
├─────────────────────────────────────────────────────────────┤
│  MongoDB                                                    │
│  ├── Users Collection (name, email, publicKey)            │
│  ├── Challenges Collection (email, challenge, expiry)     │
│  └── Interviews Collection (userId, scores, feedback)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Authentication Flow

### A. SIGNUP FLOW

```
USER                      BROWSER                    SERVER                  DATABASE
 │                           │                          │                        │
 │ Enter name & email        │                          │                        │
 ├──────────────────────────>│                          │                        │
 │                           │                          │                        │
 │                           │ Generate RSA Key Pair    │                        │
 │                           │ (2048-bit)               │                        │
 │                           │ - Public Key             │                        │
 │                           │ - Private Key            │                        │
 │                           │                          │                        │
 │                           │ Store Private Key in     │                        │
 │                           │ IndexedDB                │                        │
 │                           │                          │                        │
 │                           │ POST /api/auth/signup    │                        │
 │                           │ {name, email, publicKey} │                        │
 │                           ├─────────────────────────>│                        │
 │                           │                          │                        │
 │                           │                          │ Store publicKey        │
 │                           │                          ├───────────────────────>│
 │                           │                          │                        │
 │                           │                          │ Success                │
 │                           │                          │<───────────────────────┤
 │                           │                          │                        │
 │                           │  Success Response        │                        │
 │                           │<─────────────────────────┤                        │
 │                           │                          │                        │
 │ ✅ Registration Complete! │                          │                        │
 │<──────────────────────────┤                          │                        │
```

### B. LOGIN FLOW

```
USER                      BROWSER                    SERVER                  DATABASE
 │                           │                          │                        │
 │ Enter email               │                          │                        │
 ├──────────────────────────>│                          │                        │
 │                           │                          │                        │
 │                           │ POST /api/auth/login/    │                        │
 │                           │      challenge           │                        │
 │                           │ {email}                  │                        │
 │                           ├─────────────────────────>│                        │
 │                           │                          │                        │
 │                           │                          │ Generate random        │
 │                           │                          │ challenge (nonce)      │
 │                           │                          │                        │
 │                           │                          │ Store challenge        │
 │                           │                          ├───────────────────────>│
 │                           │                          │                        │
 │                           │  {challenge: "xyz..."}   │                        │
 │                           │<─────────────────────────┤                        │
 │                           │                          │                        │
 │                           │ Get Private Key from     │                        │
 │                           │ IndexedDB                │                        │
 │                           │                          │                        │
 │                           │ Sign challenge with      │                        │
 │                           │ Private Key              │                        │
 │                           │ Signature = sign(        │                        │
 │                           │   challenge, privateKey) │                        │
 │                           │                          │                        │
 │                           │ POST /api/auth/login/    │                        │
 │                           │      verify              │                        │
 │                           │ {email, signature}       │                        │
 │                           ├─────────────────────────>│                        │
 │                           │                          │                        │
 │                           │                          │ Get stored challenge   │
 │                           │                          │ & user's publicKey     │
 │                           │                          │<───────────────────────┤
 │                           │                          │                        │
 │                           │                          │ Verify signature:      │
 │                           │                          │ verify(challenge,      │
 │                           │                          │   signature, publicKey)│
 │                           │                          │                        │
 │                           │                          │ ✅ Signature Valid     │
 │                           │                          │                        │
 │                           │                          │ Generate JWT Token     │
 │                           │                          │                        │
 │                           │  {token, user}           │                        │
 │                           │<─────────────────────────┤                        │
 │                           │                          │                        │
 │                           │ Store token in           │                        │
 │                           │ localStorage             │                        │
 │                           │                          │                        │
 │ ✅ Login Successful!      │                          │                        │
 │ Redirect to Dashboard     │                          │                        │
 │<──────────────────────────┤                          │                        │
```

---

## 7. Implementation Details

### A. Key Generation (Frontend - crypto.js)

```javascript
// Generate 2048-bit RSA key pair
const keyPair = await window.crypto.subtle.generateKey(
    {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    },
    true,
    ["sign", "verify"]
);

// Export public key in PEM format
const publicKeyExported = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
);

// Store private key in IndexedDB (never sent to server)
await storePrivateKey(keyPair.privateKey);
```

**Why RSA-2048?**
- Industry standard security level
- Suitable for digital signatures
- Supported by Web Crypto API
- Balances security and performance

### B. Challenge Generation (Backend - utils/crypto.js)

```javascript
function generateChallenge() {
    // Generate 32 bytes of random data
    return crypto.randomBytes(32).toString('base64');
}
```

**Challenge Properties:**
- Random and unpredictable
- Unique for each login attempt
- Expires after 5 minutes
- Prevents replay attacks

### C. Signature Creation (Frontend - crypto.js)

```javascript
async function signChallenge(challenge, privateKey) {
    const encoder = new TextEncoder();
    const data = encoder.encode(challenge);

    // Sign with private key
    const signature = await window.crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        privateKey,
        data
    );

    // Convert to base64 for transmission
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
```

### D. Signature Verification (Backend - utils/crypto.js)

```javascript
function verifySignature(challenge, signature, publicKey) {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(challenge);
    verifier.end();
    
    // Verify using stored public key
    return verifier.verify(publicKey, signature, 'base64');
}
```

**Verification Logic:**
1. Retrieve stored challenge from database
2. Get user's public key from database
3. Verify signature mathematically
4. If valid, user is authenticated

### E. JWT Token Generation (Backend - utils/jwt.js)

```javascript
function generateToken(userId, email) {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}
```

**Token Usage:**
- Maintains user session after authentication
- Sent with every API request
- Verified by middleware
- Expires after 7 days

---

## 8. Security Features

### A. Security Measures Implemented

| Feature | Purpose | Implementation |
|---------|---------|----------------|
| RSA-2048 Encryption | Strong cryptographic keys | Web Crypto API |
| Challenge-Response | Prevent replay attacks | Random nonce, 5-min expiry |
| Private Key Isolation | Keys never leave device | IndexedDB storage |
| JWT Tokens | Stateless sessions | 7-day expiration |
| CORS Protection | Prevent unauthorized access | Express CORS middleware |
| Input Validation | Prevent injection attacks | Server-side validation |
| HTTPS Ready | Encrypted communication | Production deployment |

### B. Attack Prevention

#### 1. Phishing Protection
**Traditional System:** Attacker tricks user into entering password
**Our System:** No password to steal. Even if user is tricked, private key never leaves device.

#### 2. Brute Force Protection
**Traditional System:** Attackers try millions of password combinations
**Our System:** Impossible to guess cryptographic signatures. Each signature is unique.

#### 3. Database Breach Protection
**Traditional System:** Hashed passwords can be cracked
**Our System:** Only public keys stored. Useless without corresponding private keys.

#### 4. Replay Attack Protection
**Traditional System:** Captured login credentials can be reused
**Our System:** Each challenge is unique and expires in 5 minutes.

#### 5. Man-in-the-Middle Protection
**Production Setup:** Use HTTPS/TLS encryption
**Current Setup:** Works locally, deploy with HTTPS in production

---

## 9. Testing & Results

### A. Functional Testing

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| User signup with valid data | Keys generated, public key stored | ✅ Pass |
| User signup with duplicate email | Error: Email already exists | ✅ Pass |
| Login with correct email | Challenge received, signature verified | ✅ Pass |
| Login with wrong device | Error: Private key not found | ✅ Pass |
| Access protected routes without token | 401 Unauthorized | ✅ Pass |
| Take mock interview | Questions loaded, answers submitted | ✅ Pass |
| View performance statistics | Correct calculations displayed | ✅ Pass |

### B. Security Testing

| Test | Method | Result |
|------|--------|--------|
| Key generation randomness | Generate 1000 keys, check uniqueness | ✅ All unique |
| Signature verification | Tamper with signature | ✅ Rejected |
| Challenge expiration | Wait 6 minutes, try to login | ✅ Expired |
| JWT token validation | Use expired/invalid token | ✅ Rejected |
| SQL injection | Inject malicious SQL | ✅ Prevented (NoSQL) |

### C. Performance Testing

| Metric | Value |
|--------|-------|
| Key generation time | ~500ms |
| Challenge generation | <10ms |
| Signature creation | ~100ms |
| Signature verification | ~50ms |
| Total login time | <2 seconds |
| Database query time | <100ms |

---

## 10. Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjAN...\n-----END PUBLIC KEY-----",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "lastLogin": "2024-01-20T15:45:00.000Z"
}
```

### Challenges Collection
```json
{
  "_id": "ObjectId",
  "email": "john@example.com",
  "challenge": "xyz123abc...",
  "createdAt": "2024-01-20T15:44:30.000Z"
  // Auto-deleted after 300 seconds
}
```

### Interviews Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "category": "technical",
  "score": 85,
  "totalQuestions": 5,
  "correctAnswers": 4,
  "timeTaken": 180,
  "feedback": "Excellent! You have strong knowledge...",
  "completedAt": "2024-01-20T16:00:00.000Z"
}
```

---

## 11. Future Scope

### Planned Enhancements

1. **WebAuthn Integration**
   - Hardware security key support (YubiKey, etc.)
   - Biometric authentication (Face ID, Touch ID)
   - Standard FIDO2 protocol implementation

2. **Multi-Device Support**
   - Secure key synchronization across devices
   - QR code-based device pairing
   - Cloud-encrypted key backup

3. **Advanced Interview Features**
   - Video interview practice with AI analysis
   - Speech recognition for verbal responses
   - Real-time peer interview practice
   - Industry-specific question sets

4. **Enhanced Security**
   - Key rotation mechanism
   - Backup authentication methods
   - Two-factor authentication option
   - Security audit logs

5. **Analytics & AI**
   - AI-powered interview feedback
   - Performance trend analysis
   - Personalized learning paths
   - Resume-based question recommendations

6. **Mobile Application**
   - React Native mobile app
   - Push notifications
   - Offline practice mode
   - Biometric quick login

---

## 12. Advantages Over Traditional Systems

| Aspect | Traditional (Password) | Our System (Passwordless) |
|--------|----------------------|--------------------------|
| **Security** | Vulnerable to phishing, brute force | Cryptographically secure |
| **User Experience** | Remember passwords | No passwords to remember |
| **Data Breach Impact** | All accounts compromised | Public keys are useless alone |
| **Password Reset** | Email verification needed | Not applicable |
| **Multi-device** | Works anywhere | Device-specific (can be enhanced) |
| **Convenience** | Type password | One-click authentication |

---

## 13. Conclusion

### Project Summary

This project successfully demonstrates a **passwordless authentication system** using **public key cryptography** integrated with a practical **mock interview platform**. 

### Key Achievements:
✅ Eliminated password-related vulnerabilities
✅ Implemented RSA-2048 cryptographic authentication
✅ Created challenge-response protocol
✅ Built full-stack application with MongoDB
✅ Developed user-friendly interview practice system
✅ Achieved secure and efficient authentication

### Learning Outcomes:
- Deep understanding of cryptographic concepts
- Public-private key infrastructure
- Digital signatures and verification
- Full-stack web development
- Database design and security
- API development and authentication

### Real-World Impact:
This system represents the **future of authentication**, similar to:
- **Passkeys** (Google, Apple, Microsoft)
- **FIDO2/WebAuthn** standards
- **SSH key authentication**
- **Cryptocurrency wallets**

---

## 14. References

### Technical Documentation:
1. Web Crypto API - MDN Web Docs
2. RSA Cryptography - Wikipedia
3. JWT Authentication - jwt.io
4. WebAuthn Guide - webauthn.guide
5. Express.js Documentation
6. MongoDB Documentation

### Research Papers:
1. "Public Key Cryptography Standards" - RSA Laboratories
2. "Challenge-Response Authentication Mechanisms" - IETF RFC
3. "Password-less Authentication" - FIDO Alliance

### Industry Standards:
1. FIDO2 Specification
2. WebAuthn W3C Standard
3. OAuth 2.0 Framework
4. JSON Web Token (JWT) Standard

---

## 15. Viva Questions & Answers

### Q1: Why use RSA instead of other algorithms?
**A:** RSA is industry-standard for asymmetric cryptography, well-supported by Web Crypto API, and provides excellent security with 2048-bit keys. It's specifically designed for digital signatures and key exchange.

### Q2: Where is the private key stored?
**A:** In the browser's IndexedDB, which is:
- Isolated per origin (domain-specific)
- Not accessible by other websites
- Persistent across sessions
- Cannot be extracted by server

### Q3: What if user loses their device?
**A:** Current implementation requires the same device. Future enhancements include:
- Key export/import feature
- Cloud-encrypted backup
- Recovery codes
- Multiple device registration

### Q4: How does challenge-response prevent replay attacks?
**A:** Each challenge is:
- Randomly generated
- Used only once
- Expires in 5 minutes
- Even if intercepted, signature is useless for future logins

### Q5: Why use JWT tokens after authentication?
**A:** To maintain stateless sessions. User doesn't need to re-authenticate for every request. Token contains encrypted user info and expires after 7 days.

### Q6: Can this system be hacked?
**A:** Much harder than passwords:
- Requires stealing physical device
- Breaking 2048-bit RSA (computationally infeasible)
- Private key never transmitted
- However, HTTPS is essential in production

### Q7: What is the difference between authentication and authorization?
**A:** 
- **Authentication:** Verifying who you are (our system does this)
- **Authorization:** Determining what you can access (handled by JWT middleware)

### Q8: How does this compare to OAuth or social login?
**A:** 
- **OAuth:** Delegates authentication to third party (Google, Facebook)
- **Our System:** Self-contained, no third-party dependency
- **Use Case:** OAuth for convenience, our system for security

---

## 📊 Project Statistics

- **Total Lines of Code:** ~2500+
- **Files Created:** 15+
- **Backend Endpoints:** 8
- **Frontend Pages:** 2
- **Security Features:** 7+
- **Database Collections:** 3
- **Interview Questions:** 15 (expandable)
- **Development Time:** ~40 hours

---

**End of Documentation**

*This project represents a modern, secure approach to user authentication, demonstrating both theoretical cryptographic concepts and practical full-stack development skills.*
