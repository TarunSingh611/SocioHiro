const mongoose = require('mongoose');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sociohiro', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testTokenStorage() {
  try {
    console.log('🔍 Testing Instagram token storage...\n');

    // Find all users with Instagram tokens
    const users = await User.find({
      accessToken: { $exists: true, $ne: null },
      instagramId: { $exists: true, $ne: null }
    });

    console.log(`Found ${users.length} users with Instagram tokens\n`);

    for (const user of users) {
      console.log(`👤 User: ${user.username || user._id}`);
      console.log(`   Instagram ID: ${user.instagramId}`);
      console.log(`   Account Type: ${user.accountType}`);
      console.log(`   Access Token: ${user.accessToken ? '✅ Present' : '❌ Missing'}`);
      console.log(`   Token Expires In: ${user.tokenExpiresIn ? `${user.tokenExpiresIn} seconds` : '❌ Not set'}`);
      console.log(`   Last Token Refresh: ${user.lastTokenRefresh ? user.lastTokenRefresh.toISOString() : '❌ Never refreshed'}`);
      console.log(`   Token Expires At: ${user.tokenExpiresAt ? user.tokenExpiresAt.toISOString() : '❌ Not calculated'}`);
      
      // Check if token is expired
      if (user.isTokenExpired) {
        const isExpired = user.isTokenExpired();
        console.log(`   Token Expired: ${isExpired ? '❌ Yes' : '✅ No'}`);
      }
      
      // Check if token needs refresh
      if (user.needsTokenRefresh) {
        const needsRefresh = user.needsTokenRefresh();
        console.log(`   Needs Refresh: ${needsRefresh ? '⚠️ Yes' : '✅ No'}`);
      }
      
      console.log('');
    }

    // Test token refresh logic
    console.log('🔄 Testing token refresh logic...\n');
    
    const usersNeedingRefresh = await User.find({
      accessToken: { $exists: true, $ne: null },
      $or: [
        { tokenExpiresAt: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } },
        { tokenExpiresAt: { $exists: false } },
        { lastTokenRefresh: { $exists: false } }
      ]
    });

    console.log(`Users needing token refresh: ${usersNeedingRefresh.length}`);
    
    if (usersNeedingRefresh.length > 0) {
      console.log('Users that need refresh:');
      usersNeedingRefresh.forEach(user => {
        console.log(`  - ${user.username || user._id} (${user.instagramId})`);
      });
    }

    console.log('\n✅ Token storage test complete!');

  } catch (error) {
    console.error('❌ Error testing token storage:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the test
testTokenStorage(); 