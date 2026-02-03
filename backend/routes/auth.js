const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const { generateChallenge, verifySignature } = require('../utils/crypto');
const { generateToken } = require('../utils/jwt');

/**
 * POST /api/auth/signup
 * Register a new user with public key
 */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, publicKey, deviceInfo } = req.body;

        // Validation
        if (!email || !publicKey) {
            return res.status(400).json({
                success: false,
                message: 'Email and public key are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // User exists - add new device key
            const keyExists = existingUser.publicKeys.some(k => k.key === publicKey);
            
            if (keyExists) {
                return res.status(409).json({
                    success: false,
                    message: 'This device is already registered'
                });
            }

            // Add new device key
            existingUser.publicKeys.push({
                key: publicKey,
                deviceInfo: deviceInfo || 'Unknown Device',
                createdAt: new Date(),
                lastUsed: new Date()
            });

            await existingUser.save();

            return res.status(200).json({
                success: true,
                message: 'New device registered successfully',
                data: {
                    userId: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    isNewUser: false,
                    deviceCount: existingUser.publicKeys.length
                }
            });
        }

        // Create new user
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required for new user registration'
            });
        }

        const user = new User({
            name,
            email,
            publicKeys: [{
                key: publicKey,
                deviceInfo: deviceInfo || 'Unknown Device',
                createdAt: new Date(),
                lastUsed: new Date()
            }]
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                userId: user._id,
                name: user.name,
                email: user.email,
                isNewUser: true,
                deviceCount: 1
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/login/challenge
 * Generate and send challenge to user
 */
router.post('/login/challenge', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate random challenge
        const challenge = generateChallenge();

        // Store challenge in database (expires in 5 minutes)
        await Challenge.findOneAndDelete({ email }); // Remove old challenges
        await Challenge.create({ email, challenge });

        res.json({
            success: true,
            message: 'Challenge generated',
            data: {
                challenge
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to generate challenge',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/login/verify
 * Verify signature and authenticate user
 */
router.post('/login/verify', async (req, res) => {
    try {
        const { email, signature } = req.body;

        if (!email || !signature) {
            return res.status(400).json({
                success: false,
                message: 'Email and signature are required'
            });
        }

        // Get stored challenge
        const challengeDoc = await Challenge.findOne({ email });
        if (!challengeDoc) {
            return res.status(400).json({
                success: false,
                message: 'Challenge not found or expired'
            });
        }

        // Get user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Try to verify signature with all registered device keys
        let isValid = false;
        let matchedKeyIndex = -1;

        for (let i = 0; i < user.publicKeys.length; i++) {
            if (verifySignature(challengeDoc.challenge, signature, user.publicKeys[i].key)) {
                isValid = true;
                matchedKeyIndex = i;
                break;
            }
        }

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid signature. This device is not registered.'
            });
        }

        // Update last used time for the matched key
        user.publicKeys[matchedKeyIndex].lastUsed = new Date();

        // Delete used challenge
        await Challenge.findByIdAndDelete(challengeDoc._id);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id, user.email);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    deviceCount: user.publicKeys.length
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
});

/**
 * GET /api/auth/check-email
 * Check if email is already registered
 */
router.get('/check-email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        
        res.json({
            success: true,
            exists: !!user,
            deviceCount: user ? user.publicKeys.length : 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to check email'
        });
    }
});

/**
 * GET /api/auth/devices
 * Get list of registered devices for the authenticated user
 */
const { authenticateToken } = require('../middleware/auth');

router.get('/devices', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const devices = user.publicKeys.map((key, index) => ({
            id: index,
            deviceInfo: key.deviceInfo,
            createdAt: key.createdAt,
            lastUsed: key.lastUsed
        }));

        res.json({
            success: true,
            data: {
                totalDevices: devices.length,
                devices
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch devices'
        });
    }
});

/**
 * DELETE /api/auth/devices/:deviceId
 * Remove a registered device
 */
router.delete('/devices/:deviceId', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const deviceId = parseInt(req.params.deviceId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.publicKeys.length === 1) {
            return res.status(400).json({
                success: false,
                message: 'Cannot remove the last device. At least one device must remain.'
            });
        }

        if (deviceId < 0 || deviceId >= user.publicKeys.length) {
            return res.status(404).json({
                success: false,
                message: 'Device not found'
            });
        }

        user.publicKeys.splice(deviceId, 1);
        await user.save();

        res.json({
            success: true,
            message: 'Device removed successfully',
            data: {
                remainingDevices: user.publicKeys.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove device'
        });
    }
});

module.exports = router;
