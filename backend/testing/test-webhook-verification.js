const axios = require('axios');

// Test webhook verification with different scenarios
async function testWebhookVerification() {
  const baseUrl = 'http://localhost:8080';
  const webhookUrl = `${baseUrl}/api/webhooks/instagram`;
  const verifyToken = 'sociohiro_webhook_token';

  console.log('🔍 Testing webhook verification...\n');

  // Test 1: Correct parameters
  console.log('Test 1: Correct parameters');
  try {
    const response = await axios.get(webhookUrl, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': verifyToken,
        'hub.challenge': 'test_challenge_123'
      }
    });
    
    if (response.status === 200 && response.data === 'test_challenge_123') {
      console.log('✅ SUCCESS: Webhook verification works correctly!');
    } else {
      console.log('❌ FAILED: Unexpected response');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
    }
  } catch (error) {
    console.log('❌ FAILED:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Wrong verify token
  console.log('Test 2: Wrong verify token');
  try {
    const response = await axios.get(webhookUrl, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'wrong_token',
        'hub.challenge': 'test_challenge_123'
      }
    });
    console.log('❌ FAILED: Should have failed with wrong token');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ SUCCESS: Correctly rejected wrong token');
    } else {
      console.log('❌ UNEXPECTED ERROR:', error.message);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Missing parameters
  console.log('Test 3: Missing parameters');
  try {
    const response = await axios.get(webhookUrl, {
      params: {
        'hub.mode': 'subscribe',
        'hub.challenge': 'test_challenge_123'
        // Missing hub.verify_token
      }
    });
    console.log('❌ FAILED: Should have failed with missing token');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log('✅ SUCCESS: Correctly rejected missing token');
    } else {
      console.log('❌ UNEXPECTED ERROR:', error.message);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Check if server is running
  console.log('Test 4: Server health check');
  try {
    const response = await axios.get(`${baseUrl}/health`);
    if (response.status === 200) {
      console.log('✅ SUCCESS: Server is running');
    } else {
      console.log('❌ FAILED: Server health check failed');
    }
  } catch (error) {
    console.log('❌ FAILED: Server not running or health endpoint not available');
    console.log('Make sure to run: npm run dev');
  }
}

// Test Facebook App webhook configuration
function checkFacebookAppConfiguration() {
  console.log('\n📋 Facebook App Webhook Configuration Checklist:\n');
  
  console.log('1. ✅ Go to your Facebook App dashboard');
  console.log('2. ✅ Navigate to: Instagram Graph API → Webhooks');
  console.log('3. ✅ Configure these settings:');
  console.log('   - Callback URL: http://localhost:8080/api/webhooks/instagram');
  console.log('   - Verify Token: sociohiro_webhook_token');
  console.log('4. ✅ Select fields to subscribe (optional for testing)');
  console.log('5. ✅ Click "Verify and Save"');
  
  console.log('\n🔧 Alternative: Use ngrok for HTTPS webhook testing');
  console.log('   - Install: npm install -g ngrok');
  console.log('   - Run: ngrok http 5000');
  console.log('   - Use HTTPS URL in Facebook App');
}

// Run tests
async function runAllTests() {
  console.log('🚀 Instagram Graph API Webhook Verification Tests\n');
  
  await testWebhookVerification();
  checkFacebookAppConfiguration();
  
  console.log('\n📝 Next Steps:');
  console.log('1. Update your Facebook App webhook settings');
  console.log('2. Run this test again to verify');
  console.log('3. Test authentication flow');
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testWebhookVerification, checkFacebookAppConfiguration }; 