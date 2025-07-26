const InstagramApiService = require('../services/instagramApi');
const User = require('../models/User');
const Content = require('../models/Content');

class ContentController {
  // Get real Instagram content
  async getInstagramContent(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user || !user.accessToken) {
        return res.status(401).json({ error: 'Instagram access token required' });
      }

      const instagramApi = new InstagramApiService(user.accessToken);
      const instagramBusinessAccountId = await instagramApi.getInstagramBusinessAccount();
      const media = await instagramApi.getInstagramMedia(instagramBusinessAccountId);

      // Transform Instagram data to match our content format
      const transformedContent = media.map(post => ({
        id: post.id,
        title: post.caption?.substring(0, 100) || 'Instagram Post',
        description: post.caption || '',
        type: post.media_type.toLowerCase(),
        content: post.caption || '',
        mediaUrls: [post.media_url],
        hashtags: this.extractHashtags(post.caption),
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
  }

  // Get Instagram insights
  async getInstagramInsights(req, res) {
    try {
      const user = await User.findById(req.user._id);
      if (!user || !user.accessToken) {
        return res.status(401).json({ error: 'Instagram access token required' });
      }

      const instagramApi = new InstagramApiService(user.accessToken);
      const instagramBusinessAccountId = await instagramApi.getInstagramBusinessAccount();
      const insights = await instagramApi.getInstagramInsights(instagramBusinessAccountId);

      res.json(insights);
    } catch (error) {
      console.error('Error fetching Instagram insights:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Publish content to Instagram
  async publishToInstagram(req, res) {
    try {
      const { contentId } = req.params;
      const user = await User.findById(req.user._id);
      
      if (!user || !user.accessToken) {
        return res.status(401).json({ error: 'Instagram access token required' });
      }

      // Get content from database
      const content = await Content.findById(contentId);
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }

      const instagramApi = new InstagramApiService(user.accessToken);
      const instagramBusinessAccountId = await instagramApi.getInstagramBusinessAccount();

      let publishResult;

      // Determine content type and publish accordingly
      switch (content.type) {
        case 'post':
          publishResult = await instagramApi.uploadMedia(instagramBusinessAccountId, {
            mediaUrl: content.mediaUrls[0],
            caption: this.buildCaption(content),
            mediaType: 'IMAGE'
          });
          break;

        case 'carousel':
          publishResult = await instagramApi.uploadCarousel(instagramBusinessAccountId, {
            mediaUrls: content.mediaUrls,
            caption: this.buildCaption(content)
          });
          break;

        case 'story':
          publishResult = await instagramApi.uploadStory(instagramBusinessAccountId, {
            mediaUrl: content.mediaUrls[0],
            caption: this.buildCaption(content)
          });
          break;

        default:
          return res.status(400).json({ error: 'Unsupported content type' });
      }

      // Update content with Instagram data
      content.isPublished = true;
      content.publishedAt = new Date();
      content.instagramId = publishResult.id;
      content.permalink = publishResult.permalink;
      await content.save();

      res.json({
        success: true,
        message: 'Content published to Instagram successfully',
        instagramData: publishResult
      });

    } catch (error) {
      console.error('Error publishing to Instagram:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get media insights for a specific post
  async getMediaInsights(req, res) {
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
  }

  // Get comments for a post
  async getComments(req, res) {
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
  }

  // Reply to a comment
  async replyToComment(req, res) {
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
  }

  // Helper method to extract hashtags from caption
  extractHashtags(caption) {
    if (!caption) return [];
    const hashtagRegex = /#[\w]+/g;
    return caption.match(hashtagRegex) || [];
  }

  // Helper method to build Instagram caption
  buildCaption(content) {
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
  }
}

module.exports = new ContentController(); 