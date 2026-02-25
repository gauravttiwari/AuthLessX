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
        const { name, email, publicKey } = req.body;

        // Validation
        if (!name || !email || !publicKey) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and public key are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            publicKey
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                userId: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
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
        console.error('Challenge generation error:', error);
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

        // Get user and public key
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify signature
        const isValid = verifySignature(
            challengeDoc.challenge,
            signature,
            user.publicKey
        );

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid signature'
            });
        }

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
                    email: user.email
                }
            }
        });

    } catch (error) {
        console.error('Login verification error:', error);
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
            exists: !!user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to check email'
        });
    }
});

module.exports = router;
