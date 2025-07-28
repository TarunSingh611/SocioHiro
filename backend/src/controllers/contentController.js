const InstagramApiService = require('../services/instagramApi');
const User = require('../models/User');
const Content = require('../models/Content');

// Get real Instagram content
const getInstagramContent = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: 'Instagram access token required' });
    }

    const instagramApi = new InstagramApiService(user.accessToken);
    const media = await instagramApi.getInstagramMedia(50);

    // Transform Instagram data to match our content format
    const transformedContent = media.map(post => ({
      id: post.id,
      title: post.caption?.substring(0, 100) || 'Instagram Post',
      description: post.caption || '',
      type: post.media_type.toLowerCase(),
      content: post.caption || '',
      mediaUrls: [post.media_url],
      hashtags: extractHashtags(post.caption),
      location: '',
      scheduledDate: post.timestamp,
      scheduledTime: new Date(post.timestamp).toLocaleTimeString(),
      isPublished: true,
      stats: {
        likes: post.like_count || 0,
        comments: post.comments_count || 0,
        shares: 0,
        reach: post.insights?.data?.[0]?.values?.[0]?.value || 0
      },
      publishedAt: post.timestamp,
      instagramId: post.id,
      permalink: post.permalink
    }));

    res.json(transformedContent);
  } catch (error) {
    console.error('Error fetching Instagram content:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Instagram insights for a specific media item
const getInstagramInsights = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: 'Instagram access token required' });
    }

    const { mediaId } = req.query;
    if (!mediaId) {
      return res.status(400).json({ error: 'mediaId is required' });
    }

    const instagramApi = new InstagramApiService(user.accessToken);
    const insights = await instagramApi.getMediaInsights(mediaId);

    res.json(insights);
  } catch (error) {
    console.error('Error fetching Instagram insights:', error);
    res.status(500).json({ error: error.message });
  }
};

// Publish content to Instagram (not supported for direct Instagram Graph API users)
const publishToInstagram = async (req, res) => {
  res.status(400).json({ error: 'Publishing to Instagram is not supported for direct Instagram Graph API users.' });
};

// Get media insights for a specific post
const getMediaInsights = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: 'Instagram access token required' });
    }

    const instagramApi = new InstagramApiService(user.accessToken);
    const insights = await instagramApi.getMediaInsights(mediaId);

    res.json(insights);
  } catch (error) {
    console.error('Error fetching media insights:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: 'Instagram access token required' });
    }

    const instagramApi = new InstagramApiService(user.accessToken);
    const comments = await instagramApi.getComments(mediaId);

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: error.message });
  }
};

// Reply to a comment
const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { replyText } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: 'Instagram access token required' });
    }

    const instagramApi = new InstagramApiService(user.accessToken);
    const reply = await instagramApi.replyToComment(commentId, replyText);

    res.json(reply);
  } catch (error) {
    console.error('Error replying to comment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Helper method to extract hashtags from caption
const extractHashtags = (caption) => {
  if (!caption) return [];
  const hashtagRegex = /#[\w]+/g;
  return caption.match(hashtagRegex) || [];
};

// Helper method to build Instagram caption
const buildCaption = (content) => {
  let caption = content.content || '';
  
  // Add hashtags
  if (content.hashtags && content.hashtags.length > 0) {
    caption += '\n\n' + content.hashtags.join(' ');
  }
  
  // Add location if available
  if (content.location) {
    caption += '\n📍 ' + content.location;
  }
  
  return caption;
};

module.exports = {
  getInstagramContent,
  getInstagramInsights,
  publishToInstagram,
  getMediaInsights,
  getComments,
  replyToComment,
  extractHashtags,
  buildCaption
}; 