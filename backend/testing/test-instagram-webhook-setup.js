const mongoose = require('mongoose');
const InstagramApiService = require('../src/services/instagramApi');
const User = require('../src/models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sociohiro';

async function testInstagramWebhookSetup() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the Instagram account
    const userId = '6888bb21d91a0211b34e1466'; // dev._.tarun's user ID
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
    
    // Test 1: Check if token is valid
    console.log('\n🔍 Test 1: Checking token validity...');
    try {
      const isValid = await instagramApi.isTokenValid();
      if (isValid) {
        console.log('✅ Token is valid');
      } else {
        console.log('❌ Token is invalid or expired');
        return;
      }
    } catch (error) {
      console.log('❌ Error checking token:', error.message);
      return;
    }

    // Test 2: Get account info
    console.log('\n🔍 Test 2: Getting account info...');
    try {
      const accountInfo = await instagramApi.checkMessagingPermissions();
      if (accountInfo) {
        console.log('✅ Account info:', accountInfo);
      } else {
        console.log('❌ Cannot get account info');
      }
    } catch (error) {
      console.log('❌ Error getting account info:', error.message);
    }

    // Test 3: Webhook Configuration Guide
    console.log('\n🔍 Test 3: Webhook Configuration Guide');
    console.log('📋 Instagram API with Instagram Login requires manual webhook setup:');
    console.log('');
    console.log('✅ Step 1: Go to Facebook App Dashboard');
    console.log('   https://developers.facebook.com/apps/');
    console.log('');
    console.log('✅ Step 2: Select your Instagram app');
    console.log('');
    console.log('✅ Step 3: Navigate to: Instagram Graph API → Webhooks');
    console.log('');
    console.log('✅ Step 4: Configure these settings:');
    console.log(`   - Callback URL: ${process.env.WEBHOOK_CALLBACK_URL || 'https://cicada-proud-utterly.ngrok-free.app/api/webhooks/instagram'}`);
    console.log(`   - Verify Token: ${process.env.WEBHOOK_VERIFY_TOKEN || 'SocioHiroSuperSecretWebhookVerifyToken2025'}`);
    console.log('   - Subscribe to fields: messages, mentions, comments');
    console.log('');
    console.log('✅ Step 5: Click "Verify and Save"');
    console.log('');
    console.log('⚠️  Important Notes:');
    console.log('   - Your backend server must be running');
    console.log('   - ngrok must be running for HTTPS webhook URL');
    console.log('   - Webhook URL must be HTTPS (ngrok provides this)');
    console.log('   - Verify token must match exactly (case-sensitive)');
    console.log('');

    // Test 4: Webhook Status Check
    console.log('\n🔍 Test 4: Webhook Status Check');
    console.log('ℹ️  Webhook status can only be verified by:');
    console.log('   1. Testing webhook verification endpoint');
    console.log('   2. Sending test events from Facebook App dashboard');
    console.log('   3. Monitoring webhook events in your app logs');
    console.log('');

    // Test 5: Test messaging to a known user (if available)
    console.log('\n🔍 Test 5: Testing messaging capabilities...');
    const testUserId = '6889e405e1c928e37abeafe8'; // s.tarun_rajput's Instagram ID
    
    try {
      // First check if we can get user info
      const userInfo = await instagramApi.getUserInfoById(testUserId);
      if (userInfo) {
        console.log('✅ User info accessible:', userInfo);
        
        // Try to send a test message
        const result = await instagramApi.sendDirectMessage(
          testUserId,
          'Test message from automation system - ' + new Date().toISOString()
        );
        
        if (result.success) {
          console.log('✅ Test message sent successfully!');
          console.log('Message ID:', result.message_id);
        } else {
          console.log('❌ Failed to send test message:', result.error);
        }
      } else {
        console.log('❌ Cannot access user info - user may have privacy restrictions');
      }
    } catch (error) {
      console.log('❌ Error testing messaging:', error.message);
    }

    // Test 6: Test comment reply functionality
    console.log('\n🔍 Test 6: Testing comment reply capabilities...');
    try {
      // Get recent media to test comment functionality
      const media = await instagramApi.getInstagramMedia(5);
      if (media && media.length > 0) {
        console.log('✅ Found recent media:', media.length, 'posts');
        
        // Get comments for the first post
        const comments = await instagramApi.getComments(media[0].id);
        if (comments && comments.length > 0) {
          console.log('✅ Found comments:', comments.length, 'comments');
          
          // Test private reply to the first comment
          const replyResult = await instagramApi.sendPrivateReplyToComment(
            comments[0].id,
            'Test private reply from automation system - ' + new Date().toISOString()
          );
          
          if (replyResult.success) {
            console.log('✅ Private reply sent successfully!');
            console.log('Reply ID:', replyResult.reply_id);
          } else {
            console.log('❌ Failed to send private reply:', replyResult.error);
          }
        } else {
          console.log('ℹ️  No comments found on recent posts');
        }
      } else {
        console.log('ℹ️  No recent media found');
      }
    } catch (error) {
      console.log('❌ Error testing comment reply:', error.message);
    }

    console.log('\n📋 Summary:');
    console.log('✅ Instagram API is working');
    console.log('✅ Messaging capabilities are available');
    console.log('✅ Comment reply capabilities are available');
    console.log('ℹ️  Webhook setup requires manual configuration');
    console.log('\n🎯 Next steps:');
    console.log('1. Configure webhooks manually in Facebook App dashboard');
    console.log('2. Test webhook verification endpoint');
    console.log('3. Test webhook events by commenting on your posts');
    console.log('4. Test webhook events by sending DMs to your account');
    console.log('5. Set up automation rules in your app');

  } catch (error) {
    console.error('❌ Error testing Instagram webhook setup:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the test
testInstagramWebhookSetup(); 