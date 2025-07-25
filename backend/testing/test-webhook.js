const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const WEBHOOK_URL = `${BASE_URL}/api/webhooks/instagram`;
const VERIFY_TOKEN = 'sociohiro_webhook_token';

// Test webhook verification
async function testWebhookVerification() {
  console.log('🧪 Testing webhook verification...');
  
  try {
    const response = await axios.get(WEBHOOK_URL, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': VERIFY_TOKEN,
        'hub.challenge': 'test_challenge_123'
      }
    });
    
    if (response.status === 200 && response.data === 'test_challenge_123') {
      console.log('✅ Webhook verification successful!');
      return true;
    } else {
      console.log('❌ Webhook verification failed - unexpected response');
      return false;
    }
  } catch (error) {
    console.log('❌ Webhook verification failed:', error.message);
    return false;
  }
}

// Test webhook event processing
async function testWebhookEvent() {
  console.log('🧪 Testing webhook event processing...');
  
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
  
  try {
    const response = await axios.post(WEBHOOK_URL, testEvent, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200 && response.data === 'EVENT_RECEIVED') {
      console.log('✅ Webhook event processing successful!');
      return true;
    } else {
      console.log('❌ Webhook event processing failed - unexpected response');
      return false;
    }
  } catch (error) {
    console.log('❌ Webhook event processing failed:', error.message);
    return false;
  }
}

// Test authentication endpoint
async function testAuthentication() {
  console.log('🧪 Testing authentication endpoint...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/instagram`);
    
    if (response.status === 302) {
      console.log('✅ Authentication redirect successful!');
      return true;
    } else {
      console.log('❌ Authentication redirect failed');
      return false;
    }
  } catch (error) {
    if (error.response && error.response.status === 302) {
      console.log('✅ Authentication redirect successful!');
      return true;
    } else {
      console.log('❌ Authentication endpoint failed:', error.message);
      return false;
    }
  }
}

// Test health endpoint
async function testHealth() {
  console.log('🧪 Testing health endpoint...');
  
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    
    if (response.status === 200 && response.data.status === 'ok') {
      console.log('✅ Health check successful!');
      return true;
    } else {
      console.log('❌ Health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Instagram Graph API Tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealth },
    { name: 'Authentication', fn: testAuthentication },
    { name: 'Webhook Verification', fn: testWebhookVerification },
    { name: 'Webhook Event Processing', fn: testWebhookEvent }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    console.log(`\n📋 Running: ${test.name}`);
    const result = await test.fn();
    if (result) passed++;
    console.log(`   ${result ? '✅ PASSED' : '❌ FAILED'}`);
  }
  
  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your Instagram Graph API setup is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('1. Configure your Facebook App with the webhook URL');
    console.log('2. Test the full OAuth flow with a real user');
    console.log('3. Submit for app review when ready for production');
  } else {
    console.log('⚠️  Some tests failed. Check your server configuration.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testWebhookVerification,
  testWebhookEvent,
  testAuthentication,
  testHealth,
  runTests
}; 