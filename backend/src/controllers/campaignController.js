const Campaign = require('../models/Campaign');
const InstagramAccount = require('../models/InstagramAccount');
const instagramApi = require('../services/instagramApi');

// Get all campaigns for user
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user._id })
      .populate('accounts', 'username instagramId')
      .sort({ scheduledDate: 1 });
    
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

// Get single campaign
const getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('accounts', 'username instagramId');
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
};

// Create new campaign
const createCampaign = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      content,
      mediaUrls,
      scheduledDate,
      scheduledTime,
      hashtags,
      location,
      accounts
    } = req.body;

    // Combine date and time
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

    const campaign = new Campaign({
      name,
      description,
      type,
      content,
      mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : [],
      scheduledDate: scheduledDateTime,
      scheduledTime,
      hashtags: Array.isArray(hashtags) ? hashtags : [],
      location,
      accounts: Array.isArray(accounts) ? accounts : [],
      user: req.user._id,
      status: 'draft'
    });

    await campaign.save();
    
    const populatedCampaign = await Campaign.findById(campaign._id)
      .populate('accounts', 'username instagramId');
    
    res.status(201).json(populatedCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};

// Update campaign
const updateCampaign = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      content,
      mediaUrls,
      scheduledDate,
      scheduledTime,
      hashtags,
      location,
      accounts,
      isActive
    } = req.body;

    const updateData = {
      name,
      description,
      type,
      content,
      mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : [],
      hashtags: Array.isArray(hashtags) ? hashtags : [],
      location,
      accounts: Array.isArray(accounts) ? accounts : []
    };

    if (scheduledDate && scheduledTime) {
      updateData.scheduledDate = new Date(`${scheduledDate}T${scheduledTime}`);
      updateData.scheduledTime = scheduledTime;
    }

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    ).populate('accounts', 'username instagramId');

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
};

// Delete campaign
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
};

// Publish campaign to Instagram
const publishCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('accounts');

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign.status === 'published') {
      return res.status(400).json({ error: 'Campaign already published' });
    }

    const results = [];
    
    for (const account of campaign.accounts) {
      try {
        // Prepare content with hashtags
        let content = campaign.content;
        if (campaign.hashtags && campaign.hashtags.length > 0) {
          content += '\n\n' + campaign.hashtags.map(tag => `#${tag}`).join(' ');
        }

        // Publish to Instagram based on type
        let postId;
        if (campaign.type === 'story') {
          postId = await instagramApi.createStory(account.accessToken, {
            mediaUrl: campaign.mediaUrls[0],
            caption: content
          });
        } else {
          postId = await instagramApi.createPost(account.accessToken, {
            mediaUrls: campaign.mediaUrls,
            caption: content,
            location: campaign.location
          });
        }

        results.push({
          accountId: account._id,
          postId,
          publishedAt: new Date(),
          success: true
        });

      } catch (error) {
        console.error(`Error publishing to account ${account.username}:`, error);
        results.push({
          accountId: account._id,
          error: error.message,
          success: false
        });
      }
    }

    // Update campaign status
    const hasSuccess = results.some(r => r.success);
    campaign.status = hasSuccess ? 'published' : 'failed';
    campaign.publishedAt = hasSuccess ? new Date() : null;
    campaign.publishedTo = results;
    await campaign.save();

    res.json({
      campaign,
      results
    });
  } catch (error) {
    console.error('Error publishing campaign:', error);
    res.status(500).json({ error: 'Failed to publish campaign' });
  }
};

// Get scheduled campaigns
const getScheduledCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      user: req.user._id,
      status: 'scheduled',
      scheduledDate: { $gte: new Date() }
    })
    .populate('accounts', 'username instagramId')
    .sort({ scheduledDate: 1 });

    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching scheduled campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch scheduled campaigns' });
  }
};

// Schedule campaign
const scheduleCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    campaign.status = 'scheduled';
    await campaign.save();

    res.json(campaign);
  } catch (error) {
    console.error('Error scheduling campaign:', error);
    res.status(500).json({ error: 'Failed to schedule campaign' });
  }
};

// Get campaign statistics
const getCampaignStats = async (req, res) => {
  try {
    const stats = await Campaign.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalCampaigns = await Campaign.countDocuments({ user: req.user._id });
    const activeCampaigns = await Campaign.countDocuments({ 
      user: req.user._id, 
      isActive: true 
    });

    res.json({
      totalCampaigns,
      activeCampaigns,
      statusBreakdown: stats
    });
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    res.status(500).json({ error: 'Failed to fetch campaign statistics' });
  }
};

module.exports = {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  publishCampaign,
  getScheduledCampaigns,
  scheduleCampaign,
  getCampaignStats
}; 