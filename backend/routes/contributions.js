const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/contributions/submit
// @desc    Submit interview experience or question
// @access  Private
router.post('/submit', authenticateToken, async (req, res) => {
    try {
        const { type } = req.body;

        // Create submission
        const submission = new Submission({
            userId: req.user.id,
            type,
            ...req.body,
            status: 'pending'
        });

        await submission.save();

        res.json({
            success: true,
            message: 'Submission received! It will be reviewed by admin.',
            submissionId: submission._id
        });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/contributions/my-submissions
// @desc    Get user's submissions
// @access  Private
router.get('/my-submissions', authenticateToken, async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/contributions/admin/pending
// @desc    Get all pending submissions (admin only)
// @access  Private (Admin)
router.get('/admin/pending', authenticateToken, async (req, res) => {
    try {
        // TODO: Add admin role check
        const submissions = await Submission.find({ status: 'pending' })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        console.error('Error fetching pending submissions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/contributions/admin/review/:id
// @desc    Review submission (approve/reject)
// @access  Private (Admin)
router.post('/admin/review/:id', authenticateToken, async (req, res) => {
    try {
        const { status, reviewNotes, rewardCoins } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        submission.status = status;
        submission.reviewedBy = req.user.id;
        submission.reviewedAt = new Date();
        submission.reviewNotes = reviewNotes;

        // If approved, credit coins
        if (status === 'approved' && rewardCoins > 0) {
            submission.rewardCoins = rewardCoins;

            // Update user's coin balance
            await User.findByIdAndUpdate(submission.userId, {
                $inc: { coins: rewardCoins }
            });
        }

        await submission.save();

        res.json({
            success: true,
            message: `Submission ${status}`,
            submission
        });
    } catch (error) {
        console.error('Review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/contributions/stats
// @desc    Get contribution statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const stats = await Submission.aggregate([
            { $match: { userId: req.user.id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalCoins: { $sum: '$rewardCoins' }
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
