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

// Disable Express logging
app.set('env', 'production');

// MongoDB Connection with fallback
const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authlessx';
    
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log('✅ MongoDB Connected Successfully');
        console.log(`📍 Database: ${mongoURI.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas'}`);
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('⚠️  Using in-memory database fallback...');
        
        // Fallback to in-memory MongoDB
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('✅ In-Memory MongoDB Started Successfully');
            console.log('⚠️  Note: Data will not persist after server restart');
        } catch (fallbackErr) {
            console.error('❌ Failed to start in-memory database:', fallbackErr.message);
            process.exit(1);
        }
    }
};

connectDB();

// Import Routes
const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interview');
const codingRoutes = require('./routes/coding');

// Favicon handler (prevents 404 errors) - must be before static files
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Serve static files from frontend
app.use(express.static('../frontend'));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/coding', codingRoutes);

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
