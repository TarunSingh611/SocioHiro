const mongoose = require('mongoose');
const User = require('../src/models/User');
const InstagramApiService = require('../src/services/instagramApi');

// Test the enhanced Instagram account functionality
async function testEnhancedAccount() {
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect('mongodb://localhost:27017/instagram-store', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Find a user with Instagram connected
    const user = await User.findOne({ instagramId: { $exists: true, $ne: null } });
    
    if (!user) {
      console.log('❌ No user with Instagram account found');
      return;
    }
    
    console.log('👤 Found user:', user.username);
    console.log('📱 Instagram ID:', user.instagramId);
    
    // Test Instagram API service
    if (user.accessToken) {
      console.log('🔑 Testing Instagram API with access token...');
      
      const instagramApi = new InstagramApiService(user.accessToken);
      
      try {
        // Test basic user info
        const basicInfo = await instagramApi.getInstagramUserInfo();
        console.log('✅ Basic user info:', basicInfo);
        
        // Test detailed account info
        const detailedInfo = await instagramApi.getDetailedAccountInfo();
        console.log('✅ Detailed account info:', detailedInfo);
        
        // Test token validity
        const isValid = await instagramApi.isTokenValid();
        console.log('✅ Token valid:', isValid);
        
      } catch (apiError) {
        console.error('❌ Instagram API error:', apiError.message);
      }
    } else {
      console.log('❌ No access token found');
    }
    
    // Test the enhanced account structure
    console.log('\n📊 Current stored Instagram data:');
    console.log('- Full Name:', user.instagramFullName);
    console.log('- Bio:', user.instagramBio);
    console.log('- Website:', user.instagramWebsite);
    console.log('- Email:', user.instagramEmail);
    console.log('- Phone:', user.instagramPhone);
    console.log('- Location:', user.instagramLocation);
    console.log('- Is Verified:', user.instagramIsVerified);
    console.log('- Posts Count:', user.instagramPostsCount);
    console.log('- Followers Count:', user.instagramFollowersCount);
    console.log('- Following Count:', user.instagramFollowingCount);
    console.log('- Joined Date:', user.instagramJoinedDate);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test
testEnhancedAccount(); 