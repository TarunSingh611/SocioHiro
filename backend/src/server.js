const mongoose = require('mongoose');
const app = require('./app');
const { startInstagramTokenRefreshJob } = require('./services/instagramTokenCron');

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/instagramstore';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    startInstagramTokenRefreshJob(); // Start the cron job after DB is connected
    
    // Create server with timeout configuration
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend served at http://localhost:${PORT}`);
      console.log(`🔌 API available at http://localhost:${PORT}/api`);
    });
    
    // Set server timeout to 60 seconds for slow Instagram API calls
    server.timeout = 60000; // 60 seconds
    server.keepAliveTimeout = 65000; // 65 seconds
    server.headersTimeout = 66000; // 66 seconds
    
    console.log('Server timeout configured for Instagram API calls');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 