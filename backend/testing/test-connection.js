const axios = require('axios');

// Test configuration
const LOCAL_URL = 'http://localhost:8080';
const NGROK_URL = 'https://cicada-proud-utterly.ngrok-free.app';

async function testConnections() {
  console.log('🔍 Testing server connections...\n');

  // Test 1: Local server
  console.log('Test 1: Local server (localhost:5000)');
  try {
    const response = await axios.get(`${LOCAL_URL}/health`);
    if (response.status === 200) {
      console.log('✅ SUCCESS: Local server is running');
    } else {
      console.log('❌ FAILED: Local server health check failed');
    }
  } catch (error) {
    console.log('❌ FAILED: Local server not accessible');
    console.log('   Make sure to run: npm run dev');
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: ngrok server
  console.log('Test 2: ngrok server');
  try {
    const response = await axios.get(`${NGROK_URL}/health`);
    if (response.status === 200) {
      console.log('✅ SUCCESS: ngrok server is accessible');
    } else {
      console.log('❌ FAILED: ngrok server health check failed');
    }
  } catch (error) {
    console.log('❌ FAILED: ngrok server not accessible');
    console.log('   Make sure:');
    console.log('   1. Backend server is running (npm run dev)');
    console.log('   2. ngrok is running (ngrok http 5000)');
    console.log('   3. ngrok URL is correct');
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Authentication endpoint
  console.log('Test 3: Authentication endpoint');
  try {
    const response = await axios.get(`${NGROK_URL}/api/auth/instagram`);
    if (response.status === 302) {
      console.log('✅ SUCCESS: Authentication endpoint redirects correctly');
    } else {
      console.log('❌ FAILED: Authentication endpoint not working');
    }
  } catch (error) {
    if (error.response && error.response.status === 302) {
      console.log('✅ SUCCESS: Authentication endpoint redirects correctly');
    } else {
      console.log('❌ FAILED: Authentication endpoint error:', error.message);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Webhook endpoint
  console.log('Test 4: Webhook endpoint');
  try {
    const response = await axios.get(`${NGROK_URL}/api/webhooks/instagram`, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'SocioHiroSuperSecretWebhookVerifyToken2025',
        'hub.challenge': 'test_challenge_123'
      }
    });
    if (response.status === 200) {
      console.log('✅ SUCCESS: Webhook endpoint is working');
    } else {
      console.log('❌ FAILED: Webhook endpoint not working');
    }
  } catch (error) {
    console.log('❌ FAILED: Webhook endpoint error:', error.message);
  }
}

// Show configuration guide
function showConfigurationGuide() {
  console.log('\n📋 Configuration Checklist:\n');
  
  console.log('✅ Backend (.env):');
  console.log('   INSTAGRAM_APP_ID=532563143212029');
  console.log('   INSTAGRAM_APP_SECRET=your_app_secret');
  console.log('   FRONTEND_URL=https://cicada-proud-utterly.ngrok-free.app');
  console.log('   WEBHOOK_VERIFY_TOKEN=SocioHiroSuperSecretWebhookVerifyToken2025');
  
  console.log('\n✅ Frontend (.env):');
  console.log('   VITE_API_URL=https://cicada-proud-utterly.ngrok-free.app');
  
  console.log('\n✅ Facebook App Settings:');
  console.log('   - Instagram Business Login Redirect: https://cicada-proud-utterly.ngrok-free.app/auth/callback');
  console.log('   - Webhook URL: https://cicada-proud-utterly.ngrok-free.app/api/webhooks/instagram');
  console.log('   - Verify Token: SocioHiroSuperSecretWebhookVerifyToken2025');
  
  console.log('\n✅ Commands to run:');
  console.log('   1. Backend: cd backend && npm run dev');
  console.log('   2. ngrok: ngrok http 5000');
  console.log('   3. Frontend: cd frontend && npm run dev');
}

// Run tests
async function runAllTests() {
  console.log('🚀 Testing Instagram Graph API Setup\n');
  
  await testConnections();
  showConfigurationGuide();
  
  console.log('\n📝 Next Steps:');
  console.log('1. Make sure all servers are running');
  console.log('2. Test the login flow');
  console.log('3. Verify webhook configuration');
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testConnections, showConfigurationGuide }; 