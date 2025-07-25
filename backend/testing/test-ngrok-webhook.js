const axios = require('axios');

// Test configuration for ngrok
const NGROK_URL = 'https://cicada-proud-utterly.ngrok-free.app';
const WEBHOOK_URL = `${NGROK_URL}/api/webhooks/instagram`;
const VERIFY_TOKEN = 'SocioHiroSuperSecretWebhookVerifyToken2025';

async function testNgrokWebhook() {
  console.log('🔍 Testing ngrok webhook verification...\n');
  console.log(`Webhook URL: ${WEBHOOK_URL}`);
  console.log(`Verify Token: ${VERIFY_TOKEN}\n`);

  // Test 1: Correct webhook verification
  console.log('Test 1: Webhook verification with correct parameters');
  try {
    const response = await axios.get(WEBHOOK_URL, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': VERIFY_TOKEN,
        'hub.challenge': 'test_challenge_123'
      }
    });
    
    if (response.status === 200 && response.data === 'test_challenge_123') {
      console.log('✅ SUCCESS: Webhook verification works!');
      console.log('✅ Your Facebook App webhook settings should work now.');
    } else {
      console.log('❌ FAILED: Unexpected response');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
    }
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: Health check
  console.log('Test 2: Server health check');
  try {
    const response = await axios.get(`${NGROK_URL}/health`);
    if (response.status === 200) {
      console.log('✅ SUCCESS: Server is accessible via ngrok');
    } else {
      console.log('❌ FAILED: Health check failed');
    }
  } catch (error) {
    console.log('❌ FAILED: Server not accessible via ngrok');
    console.log('Make sure:');
    console.log('1. Your backend server is running (npm run dev)');
    console.log('2. ngrok is running and pointing to port 5000');
    console.log('3. The ngrok URL is correct');
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 3: Test webhook event processing
  console.log('Test 3: Webhook event processing');
  try {
    const testEvent = {
      object: 'page',
      entry: [{
        id: 'test_page_id',
        time: Date.now(),
        instagram: [{
          type: 'mention',
          data: {
            id: 'test_mention_id',
            username: 'test_user',
            text: 'Great post! @sociohiro'
          }
        }]
      }]
    };

    const response = await axios.post(WEBHOOK_URL, testEvent, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200 && response.data === 'EVENT_RECEIVED') {
      console.log('✅ SUCCESS: Webhook event processing works!');
    } else {
      console.log('❌ FAILED: Event processing failed');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
    }
  } catch (error) {
    console.log('❌ FAILED: Event processing error:', error.message);
  }
}

// Facebook App configuration guide
function showFacebookAppConfiguration() {
  console.log('\n📋 Facebook App Webhook Configuration:\n');
  
  console.log('✅ Go to your Facebook App dashboard');
  console.log('✅ Navigate to: Instagram Graph API → Webhooks');
  console.log('✅ Configure these EXACT settings:');
  console.log(`   - Callback URL: ${WEBHOOK_URL}`);
  console.log(`   - Verify Token: ${VERIFY_TOKEN}`);
  console.log('✅ Click "Verify and Save"');
  
  console.log('\n⚠️  Important Notes:');
  console.log('- Make sure your backend server is running');
  console.log('- Make sure ngrok is running and accessible');
  console.log('- The webhook URL must be HTTPS (ngrok provides this)');
  console.log('- The verify token must match exactly (case-sensitive)');
}

// Run tests
async function runNgrokTests() {
  console.log('🚀 Testing ngrok Webhook Setup\n');
  
  await testNgrokWebhook();
  showFacebookAppConfiguration();
  
  console.log('\n📝 Next Steps:');
  console.log('1. Update your Facebook App webhook settings with the correct URL');
  console.log('2. Try the verification again in Facebook App dashboard');
  console.log('3. Test with real Instagram events');
}

// Run if called directly
if (require.main === module) {
  runNgrokTests().catch(console.error);
}

module.exports = { testNgrokWebhook, showFacebookAppConfiguration }; 