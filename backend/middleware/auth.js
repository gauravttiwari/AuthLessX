const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and authenticate requests
 */
async function authenticateToken(req, res, next) {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access token required' 
            });
        }

        // Verify token
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }

        // Check if user exists
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Authentication failed' 
        });
    }
}

module.exports = { authenticateToken };
