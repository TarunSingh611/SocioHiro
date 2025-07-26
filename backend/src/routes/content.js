const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { requireAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// Get all content for the authenticated user
router.get('/', async (req, res) => {
  try {
    const Content = require('../models/Content');
    const content = await Content.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get content by ID
router.get('/:id', async (req, res) => {
  try {
    const Content = require('../models/Content');
    const content = await Content.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new content
router.post('/', async (req, res) => {
  try {
    const Content = require('../models/Content');
    const contentData = {
      ...req.body,
      userId: req.user._id
    };
    
    const content = new Content(contentData);
    await content.save();
    
    res.status(201).json(content);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update content
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
    
    res.json(content);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete content
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
    
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
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