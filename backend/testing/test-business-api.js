const InstagramApiService = require('../src/services/instagramApi');
const User = require('../src/models/User');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sociohiro', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testInstagramBusinessAPI() {
  try {
    console.log('🧪 Testing Instagram Business API Setup...\n');

    // Get a user with Instagram token (using the correct field name)
    const user = await User.findOne({ 'accessToken': { $exists: true } });
    
    if (!user || !user.accessToken) {
      console.error('❌ No user found with Instagram access token');
      return;
    }

    console.log('✅ Found user with Instagram token:', user.username);
    console.log('Instagram ID:', user.instagramId);
    console.log('Account Type:', user.accountType);
    console.log('Token:', user.accessToken.substring(0, 20) + '...');

    // Create Instagram API service
    const instagramApi = new InstagramApiService(user.accessToken);

    // Test 1: Get current user info
    console.log('\n📋 Test 1: Getting current user info...');
    try {
      const meResponse = await instagramApi.axiosInstance.get(`${instagramApi.baseUrl}/me?fields=user_id,username,account_type`);
      console.log('✅ Current user info:', meResponse.data);
    } catch (error) {
      console.error('❌ Error getting current user info:', error.response?.data || error.message);
    }

    // Test 2: Try to send DM to self (for testing)
    console.log('\n📨 Test 2: Trying to send DM to self...');
    try {
      const meData = await instagramApi.axiosInstance.get(`${instagramApi.baseUrl}/me?fields=user_id,username`);
      if (meData.data && meData.data.data && meData.data.data[0]) {
        const selfUserId = meData.data.data[0].user_id;
        console.log('Self user ID:', selfUserId);
        
        const dmResult = await instagramApi.sendDirectMessage(selfUserId, 'Test message from API');
        console.log('DM result:', dmResult);
      }
    } catch (error) {
      console.error('❌ Error sending DM to self:', error.response?.data || error.message);
    }

    // Test 3: Try to send DM to target user
    console.log('\n🎯 Test 3: Trying to send DM to target user...');
    const targetUserId = '24884966311106046'; // s.tarun_rajput's ID
    try {
      const dmResult = await instagramApi.sendDirectMessage(targetUserId, 'Hello from Instagram Business API!');
      console.log('DM result:', dmResult);
    } catch (error) {
      console.error('❌ Error sending DM to target user:', error.response?.data || error.message);
    }

    // Test 4: Get target user info
    console.log('\n👤 Test 4: Getting target user info...');
    try {
      const userInfo = await instagramApi.getUserInfo(targetUserId);
      console.log('Target user info:', userInfo);
    } catch (error) {
      console.error('❌ Error getting target user info:', error.response?.data || error.message);
    }

    console.log('\n✅ Instagram Business API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

testInstagramBusinessAPI(); 