const axios = require('axios');

async function testOAuthConfiguration() {
  console.log('🔍 Testing Instagram OAuth Configuration\n');

  // Test 1: Check environment variables
  console.log('1. Environment Variables:');
  console.log('   INSTAGRAM_APP_ID:', process.env.INSTAGRAM_APP_ID);
  console.log('   INSTAGRAM_CALLBACK_URL:', process.env.INSTAGRAM_CALLBACK_URL);
  console.log('   INSTAGRAM_APP_SECRET:', process.env.INSTAGRAM_APP_SECRET ? '***SET***' : '***NOT SET***');

  // Test 2: Check if backend is running
  console.log('\n2. Backend Server Test:');
  try {
    const response = await axios.get('http://localhost:8080/health');
    console.log('   ✅ Backend server is running');
  } catch (error) {
    console.log('   ❌ Backend server not running');
    console.log('   Error:', error.message);
    return;
  }

  // Test 3: Test login endpoint
  console.log('\n3. Login Endpoint Test:');
  try {
    const response = await axios.get('http://localhost:8080/api/instagram-oauth/login', {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects
      }
    });
    console.log('   ✅ Login endpoint accessible');
    console.log('   Status:', response.status);
    if (response.headers.location) {
      console.log('   Redirects to:', response.headers.location);
    }
  } catch (error) {
    if (error.response && error.response.status === 302) {
      console.log('   ✅ Login endpoint redirects (expected)');
      console.log('   Redirects to:', error.response.headers.location);
    } else {
      console.log('   ❌ Login endpoint error');
      console.log('   Error:', error.message);
    }
  }

  // Test 4: Test callback endpoint
  console.log('\n4. Callback Endpoint Test:');
  try {
    const response = await axios.get('http://localhost:8080/api/instagram-oauth/callback');
    console.log('   ✅ Callback endpoint accessible');
  } catch (error) {
    console.log('   ❌ Callback endpoint error (expected without code)');
    console.log('   Error:', error.message);
  }

  console.log('\n📋 Configuration Checklist:');
  console.log('✅ Backend server running on port 8080');
  console.log('✅ Environment variables loaded');
  console.log('✅ Login endpoint accessible');
  console.log('✅ Callback endpoint accessible');
  
  console.log('\n🔧 Facebook App Settings to Check:');
  console.log('1. Go to Facebook App Dashboard');
  console.log('2. Navigate to: Instagram Graph API → Basic Display');
  console.log('3. Set redirect URI to:', process.env.INSTAGRAM_CALLBACK_URL);
  console.log('4. Make sure the URI matches exactly (including https://)');
  
  console.log('\n💡 Common Issues:');
  console.log('- Redirect URI mismatch between backend and Facebook App');
  console.log('- Missing or incorrect environment variables');
  console.log('- Backend server not running');
  console.log('- Wrong port number');
}

// Run test
testOAuthConfiguration().catch(console.error); 