const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    publicKey: String,
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date
});

const User = mongoose.model('User', userSchema);

// Connect and create test user
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('✅ MongoDB Connected\n');
    
    // Create test user
    const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        publicKey: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...(sample key)...-----END PUBLIC KEY-----'
    });
    
    await testUser.save();
    console.log('✅ Test user created successfully!\n');
    
    // Check all users
    const users = await User.find();
    console.log('📊 Total Users in Database:', users.length);
    console.log('\n👥 User List:');
    users.forEach((user, index) => {
        console.log(`\n${index + 1}. Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Public Key: ${user.publicKey.substring(0, 50)}...`);
    });
    
    console.log('\n✅ Data is being stored in MongoDB Atlas!');
    process.exit(0);
})
.catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
