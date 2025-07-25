const axios = require('axios');

async function debugServer() {
  console.log('🔍 Debugging server routes...\n');

  const baseUrl = 'http://localhost:8080';

  // Test 1: Check if server is running
  console.log('Test 1: Server health check');
  try {
    const response = await axios.get(`${baseUrl}/health`);
    console.log('✅ Server is running');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Server not running or health endpoint not found');
    console.log('Error:', error.message);
    return;
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Check API root
  console.log('Test 2: API root endpoint');
  try {
    const response = await axios.get(`${baseUrl}/api`);
    console.log('✅ API root accessible');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ API root not accessible');
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Check auth routes
  console.log('Test 3: Auth routes');
  try {
    const response = await axios.get(`${baseUrl}/api/auth`);
    console.log('✅ Auth routes accessible');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Auth routes not accessible');
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Check specific Instagram auth route
  console.log('Test 4: Instagram auth route');
  try {
    const response = await axios.get(`${baseUrl}/api/auth/instagram`);
    console.log('✅ Instagram auth route accessible');
    console.log('Status:', response.status);
  } catch (error) {
    if (error.response) {
      console.log('❌ Instagram auth route error');
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('❌ Instagram auth route not accessible');
      console.log('Error:', error.message);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 5: Check if routes are properly loaded
  console.log('Test 5: Check route loading');
  try {
    const response = await axios.get(`${baseUrl}/api/auth/status`);
    console.log('✅ Auth status route accessible');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Auth status route not accessible');
    console.log('Error:', error.message);
  }
}

// Show server configuration
function showServerConfig() {
  console.log('\n📋 Server Configuration Checklist:\n');
  
  console.log('✅ Check if server is running:');
  console.log('   cd backend && npm run dev');
  console.log('   Should show: "Server running on port 8080"');
  
  console.log('\n✅ Check if routes are loaded:');
  console.log('   - /health (should return {"status":"ok"})');
  console.log('   - /api (should return {"message":"API root"})');
  console.log('   - /api/auth/status (should return auth status)');
  
  console.log('\n✅ Check environment variables:');
  console.log('   - PORT=8080');
  console.log('   - INSTAGRAM_APP_ID=532563143212029');
  console.log('   - INSTAGRAM_APP_SECRET=your_secret');
  
  console.log('\n✅ Check if all route files exist:');
  console.log('   - backend/src/routes/auth.js');
  console.log('   - backend/src/routes/index.js');
  console.log('   - backend/src/app.js');
}

// Run debug
async function runDebug() {
  console.log('🚀 Debugging Instagram Graph API Server\n');
  
  await debugServer();
  showServerConfig();
  
  console.log('\n📝 Next Steps:');
  console.log('1. Make sure server is running on port 8080');
  console.log('2. Check if all route files are properly loaded');
  console.log('3. Verify environment variables are set');
  console.log('4. Check for any syntax errors in route files');
}

// Run if called directly
if (require.main === module) {
  runDebug().catch(console.error);
}

module.exports = { debugServer, showServerConfig }; 