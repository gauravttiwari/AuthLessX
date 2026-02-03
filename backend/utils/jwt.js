const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for authenticated user
 */
function generateToken(userId, email) {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token valid for 7 days
    );
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

module.exports = {
    generateToken,
    verifyToken
};
