const mongoose = require('mongoose');
const InstagramApiService = require('../src/services/instagramApi');
const User = require('../src/models/User');

async function testSelfMessage() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-store');
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
    
    // Test 1: Get our own account info
    console.log('\n🔍 Test 1: Getting our account info...');
    try {
      const accountInfo = await instagramApi.checkMessagingPermissions();
      if (accountInfo) {
        console.log('✅ Our account info:', accountInfo);
        console.log('   Our Instagram ID:', accountInfo.id);
        console.log('   Our username:', accountInfo.username);
        
        // Test 2: Try to message ourselves
        console.log('\n🔍 Test 2: Trying to message ourselves...');
        try {
          const result = await instagramApi.sendDirectMessage(accountInfo.id, 'Test message to myself');
          if (result.success) {
            console.log('✅ SUCCESS! Can message ourselves');
            console.log('Message ID:', result.message_id);
          } else {
            console.log('❌ Failed to message ourselves:', result.error);
          }
        } catch (error) {
          console.log('❌ Error messaging ourselves:', error.response?.data?.error?.message || error.message);
        }
      } else {
        console.log('❌ Cannot get our account info');
      }
    } catch (error) {
      console.log('❌ Error getting account info:', error.message);
    }

    // Test 3: Check what permissions we have
    console.log('\n🔍 Test 3: Checking API permissions...');
    try {
      const tokenInfo = await instagramApi.getTokenInfo();
      console.log('✅ Token info:', tokenInfo);
    } catch (error) {
      console.log('❌ Error getting token info:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

testSelfMessage(); 