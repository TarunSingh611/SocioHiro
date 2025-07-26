const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const contentSyncService = require('../services/contentSyncService');
const { requireAuth } = require('../middleware/auth');
const { createDebugLogger } = require('../utils/debug');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create debug logger for content routes
const debug = createDebugLogger('CONTENT_ROUTES');

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

// Test endpoint (no auth required)
router.get('/test', (req, res) => {
  res.json({
    message: 'Content routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Apply authentication middleware to all routes except test
router.use(requireAuth);

// Get content - prioritize Instagram content, fallback to local database
router.get('/', async (req, res) => {
  try {
    const { source = 'all', limit = 25, sync = 'auto' } = req.query;

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

    res.json({
      ...result,
      lastSync: contentSyncService.getLastSyncTime(req.user._id),
      syncNeeded: contentSyncService.isSyncNeeded(req.user._id)
    });
  } catch (error) {
    debug.error('Error fetching content', error);
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

// Instagram-specific routes
router.get('/instagram/content', contentController.getInstagramContent);
router.get('/instagram/insights', contentController.getInstagramInsights);
router.post('/:id/publish', contentController.publishToInstagram);
router.get('/instagram/media/:mediaId/insights', contentController.getMediaInsights);
router.get('/instagram/media/:mediaId/comments', contentController.getComments);
router.post('/instagram/comments/:commentId/reply', contentController.replyToComment);

module.exports = router;
