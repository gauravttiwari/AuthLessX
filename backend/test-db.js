const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('✅ MongoDB Connected Successfully\n');
    
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log('📊 Database Name:', dbName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections in Database:', collections.length);
    
    if (collections.length === 0) {
        console.log('⚠️  No collections found. Database is empty.');
        console.log('💡 Tip: Try signing up a user from the frontend to create data.');
    } else {
        console.log('\n📋 Collection List:');
        for (const collection of collections) {
            const count = await mongoose.connection.db.collection(collection.name).countDocuments();
            console.log(`  - ${collection.name}: ${count} document(s)`);
            
            // Show sample data if exists
            if (count > 0) {
                const sample = await mongoose.connection.db.collection(collection.name).findOne();
                console.log(`    Sample: ${JSON.stringify(sample, null, 2).substring(0, 200)}...`);
            }
        }
    }
    
    console.log('\n✅ Database check complete!');
    process.exit(0);
})
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
});
