const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const contentSyncService = require('../services/contentSyncService');
const { requireAuth } = require('../middleware/auth');
const { createDebugLogger } = require('../utils/debug');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

console.log('📁 Content routes file loaded');

// Create debug logger for content routes
const debug = createDebugLogger('CONTENT_ROUTES');

// Log all requests to content routes
router.use('*', (req, res, next) => {
  console.log(`📥 Content router received: ${req.method} ${req.path}`);
  next();
});

// Handle CORS preflight requests for content routes
router.options('*', (req, res) => {
  console.log('🔄 OPTIONS request to content routes');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.status(200).end();
});

// Debug route to test if content routes are loaded
router.get('/debug', (req, res) => {
  console.log('🔍 GET /content/debug - Debug route hit');
  res.json({
    message: 'Content routes are loaded!',
    timestamp: new Date().toISOString(),
    availableRoutes: [
      '/test',
      '/test-content',
      '/simple-test',
      '/test-objectid',
      '/debug',
      '/',
      '/sync',
      '/sync/status',
      '/stats'
    ]
  });
});

// Test route without authentication
router.get('/test-no-auth', (req, res) => {
  console.log('🔍 GET /content/test-no-auth - Test route without auth');
  res.json({
    message: 'Test route without authentication works!',
    timestamp: new Date().toISOString(),
    headers: req.headers,
    user: req.user ? 'User found' : 'No user'
  });
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// router.use(requireAuth);

// Get content - prioritize Instagram content, fallback to local database
router.get('/', requireAuth, async (req, res) => {
  try {
    console.log('📥 GET /api/content - Request received');
    const { source = 'all', limit = 25, sync = 'auto' } = req.query;
    
    // User object should come from JWT token via requireAuth middleware
    if (!req.user) {
      console.error('❌ No user object found in request');
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    console.log('👤 User authenticated:', { userId: req.user._id, username: req.user.username });
    
    debug.log('GET /content', { source, limit, sync, userId: req.user._id });

    // Auto-sync Instagram content if needed
    if (sync === 'auto' && contentSyncService.isSyncNeeded(req.user._id)) {
      debug.log('Auto-sync needed, triggering sync');
      try {
        await contentSyncService.triggerSync(req.user._id);
        debug.log('Auto-sync completed successfully');
      } catch (syncError) {
        debug.warn('Auto-sync failed, continuing with cached data', syncError.message);
      }
    }

    // Get combined content using sync service
    const result = await contentSyncService.getCombinedContent(req.user._id, {
      limit: parseInt(limit),
      source: source
    });

    debug.log('Content fetched successfully', { count: result.content?.length || 0 });
    console.log('✅ GET /api/content - Request completed successfully');

    res.json({
      ...result,
      lastSync: contentSyncService.getLastSyncTime(req.user._id),
      syncNeeded: contentSyncService.isSyncNeeded(req.user._id)
    });
  } catch (error) {
    debug.error('Error fetching content', error);
    console.error('❌ GET /api/content - Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Manual sync Instagram content
router.post('/sync', async (req, res) => {
  try {
    const result = await contentSyncService.triggerSync(req.user._id);
    res.json({
      success: true,
      ...result,
      lastSync: contentSyncService.getLastSyncTime(req.user._id)
    });
  } catch (error) {
    console.error('Error syncing content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get sync status
router.get('/sync/status', async (req, res) => {
  try {
    res.json({
      lastSync: contentSyncService.getLastSyncTime(req.user._id),
      syncNeeded: contentSyncService.isSyncNeeded(req.user._id),
      syncInterval: contentSyncService.syncInterval
    });
  } catch (error) {
    console.error('Error getting sync status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get content statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await contentSyncService.getContentStats(req.user._id);
    res.json({
      stats: stats,
      lastSync: contentSyncService.getLastSyncTime(req.user._id)
    });
  } catch (error) {
    console.error('Error fetching content stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Instagram content specifically
router.get('/instagram', async (req, res) => {
  try {
    await contentController.getInstagramContent(req, res);
  } catch (error) {
    console.error('Error fetching Instagram content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get local database content (drafts, scheduled posts)
router.get('/local', async (req, res) => {
  try {
    const result = await contentSyncService.getCombinedContent(req.user._id, {
      source: 'local'
    });

    res.json({
      ...result,
      message: 'Local database content (drafts, scheduled posts)'
    });
  } catch (error) {
    console.error('Error fetching local content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get content by ID - check both Instagram and local database
router.get('/:id', async (req, res) => {
  try {
    const Content = require('../models/Content');

    // First check local database
    let content = await Content.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (content) {
      return res.json({
        source: content.source,
        content: content
      });
    }

    // If not found locally, try to fetch from Instagram
    try {
      const user = require('../models/User');
      const currentUser = await user.findById(req.user._id);

      if (currentUser && currentUser.accessToken) {
        // This would require implementing a method to fetch specific Instagram post
        // For now, return not found
        return res.status(404).json({ error: 'Content not found' });
      }
    } catch (instagramError) {
      console.log('Instagram fetch failed:', instagramError.message);
    }

    res.status(404).json({ error: 'Content not found' });
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new content (for drafts and scheduled posts)
router.post('/', async (req, res) => {
  try {
    const Content = require('../models/Content');
    const contentData = {
      ...req.body,
      userId: req.user._id,
      isPublished: false, // Local content is typically drafts or scheduled
      source: 'local'
    };

    const content = new Content(contentData);
    await content.save();

    res.status(201).json({
      source: 'local',
      content: content,
      message: 'Content saved as draft/scheduled post'
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update content (local database only)
router.put('/:id', async (req, res) => {
  try {
    const Content = require('../models/Content');
    const content = await Content.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({
      source: 'local',
      content: content,
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete content (local database only)
router.delete('/:id', async (req, res) => {
  try {
    const Content = require('../models/Content');
    const content = await Content.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({
      message: 'Content deleted successfully',
      source: 'local'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cleanup old Instagram content
router.delete('/cleanup', async (req, res) => {
  try {
    const { daysOld = 90 } = req.query;
    const result = await contentSyncService.cleanupOldContent(req.user._id, parseInt(daysOld));
    res.json(result);
  } catch (error) {
    console.error('Error cleaning up old content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload media files
router.post('/upload', upload.array('media', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // In a real application, you would upload these files to a cloud service
    // like AWS S3, Google Cloud Storage, or Cloudinary
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    }));

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple test endpoint without contentSyncService
router.get('/simple-test', async (req, res) => {
  try {
    console.log('GET /content/simple-test');
    res.json({
      message: 'Simple test endpoint working!',
      timestamp: new Date().toISOString(),
      user: req.user ? 'User found' : 'No user'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test ObjectId conversion
router.get('/test-objectid', async (req, res) => {
  try {
    const testId = new mongoose.Types.ObjectId("68823379150e46174ace598e");
    res.json({
      message: 'ObjectId conversion working!',
      originalId: "68823379150e46174ace598e",
      convertedId: testId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get content by associations
router.get('/associations/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const content = await contentSyncService.getContentByAssociations(req.user._id, type, id);
    
    res.json({
      content: content,
      associationType: type,
      associationId: id,
      count: content.length
    });
  } catch (error) {
    console.error('Error fetching content by associations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get high performing content
router.get('/performance/high', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const content = await contentSyncService.getHighPerformingContent(req.user._id, parseInt(limit));
    
    res.json({
      content: content,
      type: 'high-performing',
      count: content.length
    });
  } catch (error) {
    console.error('Error fetching high performing content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get underperforming content
router.get('/performance/low', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const content = await contentSyncService.getUnderperformingContent(req.user._id, parseInt(limit));
    
    res.json({
      content: content,
      type: 'underperforming',
      count: content.length
    });
  } catch (error) {
    console.error('Error fetching underperforming content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update content associations
router.put('/:id/associations', async (req, res) => {
  try {
    const { campaigns, automations, watchLists } = req.body;
    const content = await contentSyncService.updateContentAssociations(req.params.id, {
      campaigns,
      automations,
      watchLists
    });
    
    res.json({
      success: true,
      content: content,
      message: 'Content associations updated successfully'
    });
  } catch (error) {
    console.error('Error updating content associations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add content to watch list
router.post('/:id/watchlist', async (req, res) => {
  try {
    const { watchListName } = req.body;
    if (!watchListName) {
      return res.status(400).json({ error: 'watchListName is required' });
    }
    
    const content = await contentSyncService.addToWatchList(req.params.id, watchListName);
    
    res.json({
      success: true,
      content: content,
      message: `Content added to watch list: ${watchListName}`
    });
  } catch (error) {
    console.error('Error adding content to watch list:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove content from watch list
router.delete('/:id/watchlist/:watchListName', async (req, res) => {
  try {
    const { watchListName } = req.params;
    const content = await contentSyncService.removeFromWatchList(req.params.id, watchListName);
    
    res.json({
      success: true,
      content: content,
      message: `Content removed from watch list: ${watchListName}`
    });
  } catch (error) {
    console.error('Error removing content from watch list:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get content performance analysis
router.get('/:id/performance', async (req, res) => {
  try {
    const Content = require('../models/Content');
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    const performanceScore = contentSyncService.calculatePerformanceScore(content);
    const engagementRate = content.getEngagementRate();
    
    res.json({
      contentId: content._id,
      performanceScore: performanceScore,
      engagementRate: engagementRate,
      isHighPerforming: performanceScore >= 70,
      isUnderperforming: performanceScore <= 30,
      stats: content.stats,
      insights: content.insights,
      associations: {
        campaigns: content.campaigns?.length || 0,
        automations: content.automations?.length || 0,
        watchLists: content.watchLists?.length || 0
      }
    });
  } catch (error) {
    console.error('Error analyzing content performance:', error);
    res.status(500).json({ error: error.message });
  }
});

// Instagram-specific routes
router.get('/instagram/content', contentController.getInstagramContent);
router.get('/instagram/insights', contentController.getInstagramInsights);
router.post('/:id/publish', contentController.publishToInstagram);
router.get('/instagram/media/:mediaId/insights', contentController.getMediaInsights);
router.get('/instagram/media/:mediaId/comments', contentController.getComments);
router.post('/instagram/comments/:commentId/reply', contentController.replyToComment);

module.exports = router;
