const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// @route   GET /api/coins/balance
// @desc    Get user's coin balance
// @access  Private
router.get('/balance', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('coins isPremium');
        
        res.json({
            coins: user.coins || 0,
            isPremium: user.isPremium || false
        });
    } catch (error) {
        console.error('Error fetching coin balance:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/coins/unlock-premium
// @desc    Unlock premium with coins
// @access  Private
router.post('/unlock-premium', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isPremium) {
            return res.status(400).json({ message: 'Already have premium access' });
        }

        if (user.coins < 500) {
            return res.status(400).json({ 
                message: `Insufficient coins. You have ${user.coins} coins, need 500.` 
            });
        }

        // Deduct coins and activate premium
        user.coins -= 500;
        user.isPremium = true;
        user.premiumStartDate = new Date();
        
        // Premium valid for 1 month
        const premiumEnd = new Date();
        premiumEnd.setMonth(premiumEnd.getMonth() + 1);
        user.premiumEndDate = premiumEnd;

        await user.save();

        res.json({
            success: true,
            message: 'Premium unlocked successfully!',
            coins: user.coins,
            isPremium: true,
            premiumEndDate: user.premiumEndDate
        });
    } catch (error) {
        console.error('Error unlocking premium:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/coins/add (Admin only)
// @desc    Add coins to user manually
// @access  Private (Admin)
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { userId, amount, reason } = req.body;

        if (!userId || !amount) {
            return res.status(400).json({ message: 'User ID and amount required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.coins += amount;
        await user.save();

        res.json({
            success: true,
            message: `${amount} coins added to user`,
            newBalance: user.coins
        });
    } catch (error) {
        console.error('Error adding coins:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
