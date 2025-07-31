const mongoose = require('mongoose');
const InstagramApiService = require('../src/services/instagramApi');
const User = require('../src/models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-store';

async function testUserAccess() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get dev._.tarun's user data (the automation owner)
    const userId = '68823379150e46174ace598e'; // dev._.tarun's user ID
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('❌ User not found in database');
      return;
    }

    console.log('✅ Found user in database:');
    console.log('   Username:', user.username);
    console.log('   Instagram ID:', user.instagramId);
    console.log('   Account Type:', user.accountType);
    console.log('   Has Access Token:', !!user.accessToken);

    if (!user.accessToken) {
      console.log('❌ No access token found for user');
      return;
    }

    // Create Instagram API instance
    const instagramApi = new InstagramApiService(user.accessToken);
    
    // Test 1: Check if our own account is accessible
    console.log('\n🔍 Test 1: Checking our own account access...');
    try {
      const accountInfo = await instagramApi.checkMessagingPermissions();
      if (accountInfo) {
        console.log('✅ Our account info:', accountInfo);
      } else {
        console.log('❌ Cannot access our account info');
      }
    } catch (error) {
      console.log('❌ Error accessing our account:', error.message);
    }

    // Test 2: Try to get info for s.tarun_rajput (the commenter)
    console.log('\n🔍 Test 2: Checking access to s.tarun_rajput...');
    const targetUserId = '24884966311106046'; // s.tarun_rajput's Instagram ID
    
    try {
      const userInfo = await instagramApi.getUserInfo(targetUserId);
      if (userInfo) {
        console.log('✅ User info accessible:', userInfo);
      } else {
        console.log('❌ Cannot access user info - user may not exist or have privacy restrictions');
      }
    } catch (error) {
      console.log('❌ Cannot retrieve user info:', error.response?.data || error.message);
      console.log('This is expected for many Instagram users due to privacy settings');
    }

    // Test 3: Try to send a test DM (this might fail due to API limitations)
    console.log('\n🔍 Test 3: Attempting to send test DM...');
    try {
      const result = await instagramApi.sendDirectMessage(
        targetUserId,
        'Test message from automation system'
      );
      
      if (result.success) {
        console.log('✅ DM sent successfully!');
        console.log('Message ID:', result.message_id);
      } else {
        console.log('❌ Failed to send DM:', result.error);
        
        // Provide helpful error information
        if (result.error && result.error.includes('does not exist')) {
          console.log('💡 This error usually means:');
          console.log('   1. The user ID format is incorrect');
          console.log('   2. The user has privacy restrictions');
          console.log('   3. The user account is private');
          console.log('   4. Instagram API permissions are insufficient');
        }
      }
    } catch (error) {
      console.log('❌ Error sending DM:', error.message);
    }

    // Test 4: Check what permissions we have
    console.log('\n🔍 Test 4: Checking API permissions...');
    try {
      const tokenInfo = await instagramApi.getTokenInfo();
      console.log('✅ Token info:', tokenInfo);
    } catch (error) {
      console.log('❌ Error getting token info:', error.message);
    }

  } catch (error) {
    console.error('❌ Error testing user access:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the test
testUserAccess(); 