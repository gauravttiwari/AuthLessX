const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interview');
const problemsRoutes = require('./routes/problems');
const codingRoutes = require('./routes/coding');
const coinsRoutes = require('./routes/coins');
const contributionsRoutes = require('./routes/contributions');
const coursesRoutes = require('./routes/courses');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/problems', problemsRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/coins', coinsRoutes);
app.use('/api/contributions', contributionsRoutes);
app.use('/api/courses', coursesRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Server is running',
        timestamp: new Date().toISOString() 
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
});
