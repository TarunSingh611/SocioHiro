const mongoose = require('mongoose');
const InstagramApiService = require('../src/services/instagramApi');
const User = require('../src/models/User');

async function fixUserIDError() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sociohiro');
    console.log('✅ Connected to MongoDB');

    // Get dev._.tarun's data
    const user = await User.findById({ _id: '68823379150e46174ace598e' });
    if (!user || !user.accessToken) {
      console.log('❌ User not found or no access token');
      return;
    }

    console.log('✅ Found user:', user.username);
    console.log('   Instagram ID:', user.instagramId);

    const instagramApi = new InstagramApiService(user.accessToken);
    
    // Test different user ID formats
    const testIds = [
      '24884966311106046',  // Original
      '17841403236811401',  // Alternative from your data
      's.tarun_rajput'      // Username
    ];

    for (const testId of testIds) {
      console.log(`\n--- Testing ID: ${testId} ---`);
      
      try {
        const result = await instagramApi.sendDirectMessage(testId, 'Test message');
        if (result.success) {
          console.log('✅ SUCCESS with ID:', testId);
          break;
        } else {
          console.log('❌ Failed:', result.error);
        }
      } catch (error) {
        console.log('❌ Error:', error.response?.data?.error?.message || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

fixUserIDError(); 