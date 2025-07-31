const mongoose = require('mongoose');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sociohiro', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function forceRemoveFacebookIdIndex() {
  try {
    console.log('🔧 Force removing facebookId index and data...');
    
    // Wait for connection to be established
    await mongoose.connection.asPromise();
    
    // Get the database connection
    const db = mongoose.connection.db;
    
    // List all indexes on the users collection
    const indexes = await db.collection('users').indexes();
    console.log('📋 Current indexes on users collection:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Try to drop the facebookId index specifically
    try {
      await db.collection('users').dropIndex('facebookId_1');
      console.log('✅ Successfully dropped facebookId_1 index');
    } catch (dropError) {
      console.log('ℹ️  facebookId_1 index not found or already removed');
    }
    
    // Also try to drop any index that includes facebookId
    try {
      await db.collection('users').dropIndex('facebookId');
      console.log('✅ Successfully dropped facebookId index');
    } catch (dropError) {
      console.log('ℹ️  facebookId index not found or already removed');
    }
    
    // Remove facebookId field from all documents
    const updateResult = await db.collection('users').updateMany(
      {},
      { $unset: { facebookId: "" } }
    );
    console.log(`✅ Removed facebookId field from ${updateResult.modifiedCount} documents`);
    
    // Verify no documents have facebookId field
    const usersWithFacebookId = await db.collection('users').find({ facebookId: { $exists: true } }).toArray();
    console.log(`📊 Documents still with facebookId field: ${usersWithFacebookId.length}`);
    
    if (usersWithFacebookId.length === 0) {
      console.log('✅ All facebookId fields successfully removed!');
    } else {
      console.log('⚠️  Some documents still have facebookId field');
      usersWithFacebookId.forEach(doc => {
        console.log(`  - User ID: ${doc._id}, username: ${doc.username}`);
      });
    }
    
    // List indexes again to confirm facebookId index is gone
    const indexesAfter = await db.collection('users').indexes();
    console.log('📋 Indexes after cleanup:');
    indexesAfter.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the force cleanup
forceRemoveFacebookIdIndex(); 