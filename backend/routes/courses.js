const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/courses
 * Get all available courses
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user?.userId;

        const courses = await Course.find()
            .select('courseId title description difficulty duration isPremium thumbnail instructor enrolledCount rating reviewCount tags')
            .sort({ enrolledCount: -1 });

        // Check if user is premium
        let isPremiumUser = false;
        let userProgress = {};
        
        if (userId) {
            const user = await User.findById(userId).select('isPremium premiumEndDate coursesProgress');
            isPremiumUser = user?.isPremium && (!user.premiumEndDate || user.premiumEndDate > new Date());
            
            // Create a map of course progress
            user?.coursesProgress?.forEach(cp => {
                userProgress[cp.courseId] = {
                    completedLessons: cp.completedLessons || [],
                    lastAccessed: cp.lastAccessed
                };
            });
        }

        const coursesWithAccess = courses.map(course => ({
            ...course.toObject(),
            hasAccess: !course.isPremium || isPremiumUser,
            progress: userProgress[course.courseId] || null
        }));

        res.json({
            success: true,
            data: {
                courses: coursesWithAccess,
                isPremiumUser
            }
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
            error: error.message
        });
    }
});

/**
 * GET /api/courses/:courseId
 * Get detailed course information
 */
router.get('/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?.userId;

        const course = await Course.findOne({ courseId });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user is premium
        let isPremiumUser = false;
        let completedLessons = [];
        
        if (userId) {
            const user = await User.findById(userId).select('isPremium premiumEndDate coursesProgress');
            isPremiumUser = user?.isPremium && (!user.premiumEndDate || user.premiumEndDate > new Date());
            
            const courseProgress = user?.coursesProgress?.find(cp => cp.courseId === courseId);
            completedLessons = courseProgress?.completedLessons || [];
        }

        const hasAccess = !course.isPremium || isPremiumUser;

        // If no access, return limited information
        if (!hasAccess) {
            return res.json({
                success: true,
                data: {
                    courseId: course.courseId,
                    title: course.title,
                    description: course.description,
                    difficulty: course.difficulty,
                    duration: course.duration,
                    isPremium: course.isPremium,
                    thumbnail: course.thumbnail,
                    instructor: course.instructor,
                    enrolledCount: course.enrolledCount,
                    rating: course.rating,
                    reviewCount: course.reviewCount,
                    tags: course.tags,
                    hasAccess: false,
                    sectionsCount: course.sections.length,
                    lessonsCount: course.sections.reduce((acc, sec) => acc + sec.lessons.length, 0)
                }
            });
        }

        // Return full course with sections and lessons
        res.json({
            success: true,
            data: {
                ...course.toObject(),
                hasAccess: true,
                completedLessons
            }
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course',
            error: error.message
        });
    }
});

/**
 * POST /api/courses/:courseId/lessons/:lessonId/complete
 * Mark a lesson as completed
 */
router.post('/:courseId/lessons/:lessonId/complete', authenticateToken, async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        
        // Check if user has premium
        const isPremiumUser = user.isPremium && (!user.premiumEndDate || user.premiumEndDate > new Date());
        
        if (!isPremiumUser) {
            return res.status(403).json({
                success: false,
                message: 'Premium membership required'
            });
        }

        // Find or create course progress
        const courseProgressIndex = user.coursesProgress.findIndex(cp => cp.courseId === courseId);
        
        if (courseProgressIndex === -1) {
            user.coursesProgress.push({
                courseId,
                completedLessons: [lessonId],
                lastAccessed: new Date()
            });
        } else {
            if (!user.coursesProgress[courseProgressIndex].completedLessons.includes(lessonId)) {
                user.coursesProgress[courseProgressIndex].completedLessons.push(lessonId);
            }
            user.coursesProgress[courseProgressIndex].lastAccessed = new Date();
        }

        await user.save();

        res.json({
            success: true,
            message: 'Lesson marked as completed'
        });
    } catch (error) {
        console.error('Error completing lesson:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete lesson',
            error: error.message
        });
    }
});

/**
 * GET /api/courses/user/progress
 * Get user's course progress
 */
router.get('/user/progress', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId).select('coursesProgress isPremium premiumEndDate');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isPremiumUser = user.isPremium && (!user.premiumEndDate || user.premiumEndDate > new Date());

        res.json({
            success: true,
            data: {
                progress: user.coursesProgress || [],
                isPremium: isPremiumUser,
                premiumEndDate: user.premiumEndDate
            }
        });
    } catch (error) {
        console.error('Error fetching user progress:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch progress',
            error: error.message
        });
    }
});

module.exports = router;
