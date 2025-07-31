const mongoose = require('mongoose');
const InstagramApiService = require('../src/services/instagramApi');
const User = require('../src/models/User');

async function fixDMWorking() {
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
    
    // Step 1: Get our own account info to understand the ID format
    console.log('\n🔍 Step 1: Getting our account info...');
    let ourAccountInfo;
    try {
      ourAccountInfo = await instagramApi.checkMessagingPermissions();
      if (ourAccountInfo) {
        console.log('✅ Our account info:', ourAccountInfo);
        console.log('   Our Instagram ID:', ourAccountInfo.id);
        console.log('   Our username:', ourAccountInfo.username);
        console.log('   ID format example:', typeof ourAccountInfo.id);
      }
    } catch (error) {
      console.log('❌ Error getting account info:', error.message);
      return;
    }

    // Step 2: Test messaging ourselves first
    console.log('\n🔍 Step 2: Testing self-messaging...');
    try {
      const selfResult = await instagramApi.sendDirectMessage(ourAccountInfo.id, 'Test message to myself');
      if (selfResult.success) {
        console.log('✅ SUCCESS! Can message ourselves');
        console.log('Message ID:', selfResult.message_id);
        console.log('This confirms our API setup works!');
      } else {
        console.log('❌ Failed to message ourselves:', selfResult.error);
        return;
      }
    } catch (error) {
      console.log('❌ Error messaging ourselves:', error.response?.data?.error?.message || error.message);
      return;
    }

    // Step 3: Try to get user info for s.tarun_rajput using different approaches
    console.log('\n🔍 Step 3: Finding correct user ID for s.tarun_rajput...');
    
    // Test different ID formats and approaches
    const testApproaches = [
      {
        name: 'Original ID (numeric)',
        id: '24884966311106046',
        description: 'ID from webhook data'
      },
      {
        name: 'Alternative ID (numeric)',
        id: '17841403236811401',
        description: 'ID from user data'
      },
      {
        name: 'String ID format',
        id: '"24884966311106046"',
        description: 'ID as string'
      },
      {
        name: 'Username approach',
        id: 's.tarun_rajput',
        description: 'Using username instead of ID'
      },
      {
        name: 'Our own ID format',
        id: ourAccountInfo.id,
        description: 'Using same format as our working ID'
      }
    ];

    for (const approach of testApproaches) {
      console.log(`\n--- Testing: ${approach.name} ---`);
      console.log(`ID: ${approach.id}`);
      console.log(`Description: ${approach.description}`);
      
      try {
        // First try to get user info
        console.log('Getting user info...');
        const userInfo = await instagramApi.getUserInfo(approach.id);
        if (userInfo) {
          console.log('✅ User info accessible:', userInfo);
          console.log('   User ID:', userInfo.id);
          console.log('   Username:', userInfo.username);
          
          // Now try to send DM
          console.log('Sending DM...');
          const dmResult = await instagramApi.sendDirectMessage(approach.id, 'Test message from automation');
          if (dmResult.success) {
            console.log('✅ SUCCESS! DM sent successfully!');
            console.log('Message ID:', dmResult.message_id);
            console.log('🎉 FOUND WORKING APPROACH!');
            console.log(`Use this ID format: ${approach.id}`);
            return;
          } else {
            console.log('❌ DM failed:', dmResult.error);
          }
        } else {
          console.log('❌ Cannot get user info');
          
          // Still try DM even if we can't get user info
          console.log('Still trying DM...');
          const dmResult = await instagramApi.sendDirectMessage(approach.id, 'Test message from automation');
          if (dmResult.success) {
            console.log('✅ SUCCESS! DM sent successfully!');
            console.log('Message ID:', dmResult.message_id);
            console.log('🎉 FOUND WORKING APPROACH!');
            console.log(`Use this ID format: ${approach.id}`);
            return;
          } else {
            console.log('❌ DM failed:', dmResult.error);
          }
        }
      } catch (error) {
        console.log('❌ Error:', error.response?.data?.error?.message || error.message);
      }
    }

    console.log('\n❌ All approaches failed. This might be due to:');
    console.log('1. Instagram API permissions');
    console.log('2. User privacy settings');
    console.log('3. Account type restrictions');
    console.log('4. Need to use different API endpoint');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

fixDMWorking(); 