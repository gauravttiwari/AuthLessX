# 🎯 Example Projects - AuthLessX Integration

Real-world examples showing how to integrate AuthLessX authentication in different types of projects.

---

## 1. 🛒 E-Commerce Website

### Project Structure:
```
ecommerce-app/
├── backend/
│   ├── routes/
│   │   ├── auth.js          ← From AuthLessX
│   │   ├── products.js      ← Your routes
│   │   ├── cart.js
│   │   └── orders.js
│   ├── models/
│   │   ├── User.js          ← From AuthLessX (extended)
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   └── middleware/
│       └── auth.js          ← From AuthLessX
```

### Extended User Model:
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
    // AuthLessX fields
    name: String,
    email: String,
    publicKeys: [{ key: String, deviceInfo: String, createdAt: Date }],
    
    // E-commerce specific fields
    shippingAddresses: [{
        street: String,
        city: String,
        pincode: String,
        phone: String
    }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});
```

### Protected Routes Example:
```javascript
// routes/orders.js
const { authenticateToken } = require('../middleware/auth');

// Get user's orders (Protected)
router.get('/my-orders', authenticateToken, async (req, res) => {
    const orders = await Order.find({ userId: req.user.userId })
        .populate('products.productId')
        .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
});

// Create order (Protected)
router.post('/checkout', authenticateToken, async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    const order = new Order({
        userId: req.user.userId,
        items: items,
        shippingAddress: shippingAddress,
        total: calculateTotal(items),
        status: 'pending'
    });
    
    await order.save();
    res.json({ success: true, order });
});
```

---

## 2. 📝 Blogging Platform

### Project Structure:
```
blog-app/
├── backend/
│   ├── routes/
│   │   ├── auth.js          ← From AuthLessX
│   │   ├── posts.js
│   │   ├── comments.js
│   │   └── profile.js
│   └── models/
│       ├── User.js          ← From AuthLessX
│       ├── Post.js
│       └── Comment.js
```

### Blog Routes:
```javascript
// routes/posts.js
const { authenticateToken } = require('../middleware/auth');

// Public: Get all posts
router.get('/posts', async (req, res) => {
    const posts = await Post.find({ published: true })
        .populate('author', 'name email')
        .sort({ createdAt: -1 });
    res.json({ success: true, posts });
});

// Protected: Create post (requires authentication)
router.post('/posts', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    
    const post = new Post({
        title,
        content,
        author: req.user.userId,
        tags: tags || [],
        published: true,
        createdAt: new Date()
    });
    
    await post.save();
    res.json({ success: true, post });
});

// Protected: Update own post
router.put('/posts/:id', authenticateToken, async (req, res) => {
    const post = await Post.findById(req.params.id);
    
    // Check ownership
    if (post.author.toString() !== req.user.userId) {
        return res.status(403).json({ 
            success: false, 
            message: 'Not authorized' 
        });
    }
    
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.updatedAt = new Date();
    
    await post.save();
    res.json({ success: true, post });
});
```

---

## 3. 📊 Project Management Tool

### Project Structure:
```
project-manager/
├── backend/
│   ├── routes/
│   │   ├── auth.js          ← From AuthLessX
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── teams.js
│   └── models/
│       ├── User.js          ← From AuthLessX
│       ├── Project.js
│       ├── Task.js
│       └── Team.js
```

### Team Collaboration Routes:
```javascript
// routes/projects.js
const { authenticateToken } = require('../middleware/auth');

// Get user's projects
router.get('/my-projects', authenticateToken, async (req, res) => {
    const projects = await Project.find({ 
        $or: [
            { owner: req.user.userId },
            { members: req.user.userId }
        ]
    }).populate('owner', 'name email')
      .populate('members', 'name email');
    
    res.json({ success: true, projects });
});

// Create new project
router.post('/projects', authenticateToken, async (req, res) => {
    const { name, description, deadline } = req.body;
    
    const project = new Project({
        name,
        description,
        owner: req.user.userId,
        members: [req.user.userId],
        deadline: deadline ? new Date(deadline) : null,
        status: 'active'
    });
    
    await project.save();
    res.json({ success: true, project });
});

// Add team member
router.post('/projects/:id/members', authenticateToken, async (req, res) => {
    const project = await Project.findById(req.params.id);
    
    // Only owner can add members
    if (project.owner.toString() !== req.user.userId) {
        return res.status(403).json({ 
            success: false, 
            message: 'Only project owner can add members' 
        });
    }
    
    const { userEmail } = req.body;
    const newMember = await User.findOne({ email: userEmail });
    
    if (!newMember) {
        return res.status(404).json({ 
            success: false, 
            message: 'User not found' 
        });
    }
    
    if (!project.members.includes(newMember._id)) {
        project.members.push(newMember._id);
        await project.save();
    }
    
    res.json({ success: true, project });
});
```

---

## 4. 🎓 Online Learning Platform

### Project Structure:
```
learning-platform/
├── backend/
│   ├── routes/
│   │   ├── auth.js          ← From AuthLessX
│   │   ├── courses.js
│   │   ├── lessons.js
│   │   └── progress.js
│   └── models/
│       ├── User.js          ← From AuthLessX (with student/instructor role)
│       ├── Course.js
│       ├── Lesson.js
│       └── Progress.js
```

### Course Routes with Role-Based Access:
```javascript
// routes/courses.js
const { authenticateToken } = require('../middleware/auth');

// Middleware for instructor-only access
async function isInstructor(req, res, next) {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'instructor' && user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Instructor access required' 
        });
    }
    next();
}

// Public: Browse courses
router.get('/courses', async (req, res) => {
    const courses = await Course.find({ published: true })
        .populate('instructor', 'name')
        .select('title description thumbnail price rating');
    res.json({ success: true, courses });
});

// Protected: Enroll in course
router.post('/courses/:id/enroll', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId);
    const course = await Course.findById(req.params.id);
    
    if (user.enrolledCourses.includes(course._id)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Already enrolled' 
        });
    }
    
    user.enrolledCourses.push(course._id);
    course.students.push(user._id);
    
    await user.save();
    await course.save();
    
    res.json({ success: true, message: 'Enrolled successfully' });
});

// Protected + Instructor: Create course
router.post('/courses', authenticateToken, isInstructor, async (req, res) => {
    const { title, description, price, category } = req.body;
    
    const course = new Course({
        title,
        description,
        instructor: req.user.userId,
        price: price || 0,
        category,
        published: false,
        students: [],
        lessons: []
    });
    
    await course.save();
    res.json({ success: true, course });
});
```

---

## 5. 💬 Real-time Chat Application

### Project Structure:
```
chat-app/
├── backend/
│   ├── routes/
│   │   ├── auth.js          ← From AuthLessX
│   │   ├── messages.js
│   │   └── rooms.js
│   ├── socket/
│   │   └── chat.js
│   └── models/
│       ├── User.js          ← From AuthLessX
│       ├── Room.js
│       └── Message.js
```

### Socket.IO with Authentication:
```javascript
// socket/chat.js
const socketIO = require('socket.io');
const { verifyToken } = require('../utils/jwt');

function initializeSocket(server) {
    const io = socketIO(server);
    
    // Socket authentication middleware
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        
        if (!token) {
            return next(new Error('Authentication required'));
        }
        
        const decoded = verifyToken(token);
        if (!decoded) {
            return next(new Error('Invalid token'));
        }
        
        socket.userId = decoded.userId;
        socket.userEmail = decoded.email;
        next();
    });
    
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userEmail}`);
        
        // Join room
        socket.on('join-room', async (roomId) => {
            socket.join(roomId);
            
            // Broadcast to room
            socket.to(roomId).emit('user-joined', {
                userId: socket.userId,
                email: socket.userEmail
            });
        });
        
        // Send message
        socket.on('send-message', async (data) => {
            const { roomId, message } = data;
            
            // Save to database
            const newMessage = new Message({
                room: roomId,
                sender: socket.userId,
                content: message,
                timestamp: new Date()
            });
            await newMessage.save();
            
            // Broadcast to room
            io.to(roomId).emit('new-message', {
                messageId: newMessage._id,
                sender: socket.userEmail,
                content: message,
                timestamp: newMessage.timestamp
            });
        });
        
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userEmail}`);
        });
    });
    
    return io;
}

module.exports = initializeSocket;
```

### Frontend Integration:
```javascript
// frontend/js/chat.js
const socket = io('http://localhost:3000', {
    auth: {
        token: localStorage.getItem('authToken')
    }
});

socket.on('connect', () => {
    console.log('Connected to chat server');
    socket.emit('join-room', 'room-123');
});

socket.on('new-message', (data) => {
    displayMessage(data);
});

function sendMessage() {
    const message = document.getElementById('message-input').value;
    socket.emit('send-message', {
        roomId: 'room-123',
        message: message
    });
}
```

---

## 6. 🏥 Healthcare Management System

### Extended User Model with Roles:
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
    // AuthLessX fields
    name: String,
    email: String,
    publicKeys: [{ key: String, deviceInfo: String }],
    
    // Healthcare specific
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient'
    },
    profile: {
        phone: String,
        address: String,
        dateOfBirth: Date,
        gender: String,
        bloodGroup: String
    },
    // Doctor specific
    specialization: String,
    licenseNumber: String,
    // Patient specific
    medicalHistory: [{
        condition: String,
        diagnosedOn: Date,
        notes: String
    }]
});
```

### Role-based Routes:
```javascript
// routes/appointments.js
const { authenticateToken } = require('../middleware/auth');

// Patient: Book appointment
router.post('/book', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId);
    
    if (user.role !== 'patient') {
        return res.status(403).json({ 
            success: false, 
            message: 'Only patients can book appointments' 
        });
    }
    
    const { doctorId, date, reason } = req.body;
    
    const appointment = new Appointment({
        patient: req.user.userId,
        doctor: doctorId,
        date: new Date(date),
        reason: reason,
        status: 'pending'
    });
    
    await appointment.save();
    res.json({ success: true, appointment });
});

// Doctor: View appointments
router.get('/my-appointments', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId);
    
    if (user.role !== 'doctor') {
        return res.status(403).json({ 
            success: false, 
            message: 'Doctor access required' 
        });
    }
    
    const appointments = await Appointment.find({ doctor: req.user.userId })
        .populate('patient', 'name email phone')
        .sort({ date: 1 });
    
    res.json({ success: true, appointments });
});
```

---

## 🎯 Common Patterns Across All Examples

### 1. **Route Protection**
```javascript
const { authenticateToken } = require('../middleware/auth');

// Use in any route that needs authentication
router.get('/protected-route', authenticateToken, handler);
```

### 2. **User Context Access**
```javascript
// Inside any protected route:
req.user.userId  // MongoDB ObjectId of user
req.user.email   // User's email
```

### 3. **Role-Based Access**
```javascript
async function checkRole(requiredRole) {
    return async (req, res, next) => {
        const user = await User.findById(req.user.userId);
        if (user.role !== requiredRole) {
            return res.status(403).json({ 
                success: false, 
                message: 'Insufficient permissions' 
            });
        }
        next();
    };
}

// Usage
router.post('/admin-only', authenticateToken, checkRole('admin'), handler);
```

### 4. **Frontend API Calls**
```javascript
// Helper function for authenticated requests
async function apiCall(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('authToken');
    
    const options = {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`http://localhost:3000/api${endpoint}`, options);
    
    if (response.status === 401) {
        // Token expired
        localStorage.removeItem('authToken');
        window.location.href = '/login.html';
        return;
    }
    
    return await response.json();
}

// Usage
const orders = await apiCall('/orders/my-orders');
await apiCall('/posts', 'POST', { title: 'New Post', content: '...' });
```

---

## 📋 Integration Checklist for Each Project Type

- [ ] Copy AuthLessX authentication files
- [ ] Extend User model with project-specific fields
- [ ] Add role field if needed (admin, user, etc.)
- [ ] Create project-specific routes
- [ ] Protect routes with `authenticateToken`
- [ ] Add role-based middleware if needed
- [ ] Update frontend to use auth system
- [ ] Test authentication flow
- [ ] Test protected routes
- [ ] Deploy! 🚀

---

**Choose your project type and start integrating! Each example is production-ready.** ✨
