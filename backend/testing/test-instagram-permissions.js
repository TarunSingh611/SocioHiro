const mongoose = require('mongoose');
const InstagramApiService = require('../src/services/instagramApi');
const User = require('../src/models/User');

async function testInstagramPermissions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sociohiro');
    console.log('✅ Connected to MongoDB');

    // Get dev._.tarun's data
    const user = await User.findById('68823379150e46174ace598e');
    if (!user || !user.accessToken) {
      console.log('❌ User not found or no access token');
      return;
    }

    console.log('✅ Found user:', user.username);
    console.log('   Instagram ID:', user.instagramId);

    const instagramApi = new InstagramApiService(user.accessToken);
    
    // Test 1: Check token validity and permissions
    console.log('\n🔍 Test 1: Checking token and permissions...');
    try {
      const tokenInfo = await instagramApi.getTokenInfo();
      console.log('✅ Token info:', tokenInfo);
      
      if (tokenInfo && tokenInfo.scopes) {
        console.log('Available scopes:', tokenInfo.scopes);
        const requiredScopes = ['pages_messaging', 'instagram_basic', 'instagram_manage_comments'];
        for (const scope of requiredScopes) {
          if (tokenInfo.scopes.includes(scope)) {
            console.log(`✅ Has scope: ${scope}`);
          } else {
            console.log(`❌ Missing scope: ${scope}`);
          }
        }
      }
    } catch (error) {
      console.log('❌ Error getting token info:', error.message);
    }

    // Test 2: Check account info
    console.log('\n🔍 Test 2: Checking account info...');
    try {
      const accountInfo = await instagramApi.checkMessagingPermissions();
      if (accountInfo) {
        console.log('✅ Account info:', accountInfo);
        console.log('   Account type:', accountInfo.account_type);
        console.log('   Can message:', accountInfo.can_message || 'Unknown');
      } else {
        console.log('❌ Cannot get account info');
      }
    } catch (error) {
      console.log('❌ Error getting account info:', error.message);
    }

    // Test 3: Try to get our own user info
    console.log('\n🔍 Test 3: Getting our own user info...');
    try {
      const ourUserInfo = await instagramApi.getUserInfo(user.instagramId);
      if (ourUserInfo) {
        console.log('✅ Our user info:', ourUserInfo);
        console.log('   Our ID format:', typeof ourUserInfo.id);
        console.log('   Our ID value:', ourUserInfo.id);
      } else {
        console.log('❌ Cannot get our user info');
      }
    } catch (error) {
      console.log('❌ Error getting our user info:', error.message);
    }

    // Test 4: Try to message ourselves
    console.log('\n🔍 Test 4: Testing self-messaging...');
    try {
      const selfResult = await instagramApi.sendDirectMessage(user.instagramId, 'Test message to myself');
      if (selfResult.success) {
        console.log('✅ SUCCESS! Can message ourselves');
        console.log('Message ID:', selfResult.message_id);
        console.log('This confirms our API setup works!');
      } else {
        console.log('❌ Failed to message ourselves:', selfResult.error);
      }
    } catch (error) {
      console.log('❌ Error messaging ourselves:', error.response?.data?.error?.message || error.message);
    }

    // Test 5: Check if we can access s.tarun_rajput's info
    console.log('\n🔍 Test 5: Checking access to s.tarun_rajput...');
    const targetUserIds = [
      '24884966311106046',
      '17841403236811401',
      user.instagramId // Try with our own ID format
    ];

    for (const targetId of targetUserIds) {
      console.log(`\n--- Testing ID: ${targetId} ---`);
      
      try {
        // Try to get user info
        const userInfo = await instagramApi.getUserInfo(targetId);
        if (userInfo) {
          console.log('✅ User info accessible:', userInfo);
          console.log('   User ID:', userInfo.id);
          console.log('   Username:', userInfo.username);
          
          // Try to send DM
          const dmResult = await instagramApi.sendDirectMessage(targetId, 'Test message from automation');
          if (dmResult.success) {
            console.log('✅ SUCCESS! DM sent successfully!');
            console.log('Message ID:', dmResult.message_id);
            console.log('🎉 FOUND WORKING ID FORMAT!');
            console.log(`Use this ID: ${targetId}`);
            return;
          } else {
            console.log('❌ DM failed:', dmResult.error);
          }
        } else {
          console.log('❌ Cannot get user info');
          
          // Still try DM
          const dmResult = await instagramApi.sendDirectMessage(targetId, 'Test message from automation');
          if (dmResult.success) {
            console.log('✅ SUCCESS! DM sent successfully!');
            console.log('Message ID:', dmResult.message_id);
            console.log('🎉 FOUND WORKING ID FORMAT!');
            console.log(`Use this ID: ${targetId}`);
            return;
          } else {
            console.log('❌ DM failed:', dmResult.error);
          }
        }
      } catch (error) {
        console.log('❌ Error:', error.response?.data?.error?.message || error.message);
      }
    }

    console.log('\n❌ All tests failed. Possible issues:');
    console.log('1. Instagram API permissions insufficient');
    console.log('2. User IDs don\'t exist or are private');
    console.log('3. Instagram API endpoints not available');
    console.log('4. Need to use different API version');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

testInstagramPermissions(); 