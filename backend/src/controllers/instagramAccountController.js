const InstagramAccount = require('../models/InstagramAccount');
const InstagramApiService = require('../services/instagramApi');
const { requireAuth } = require('../middleware/auth');

class InstagramAccountController {
  // Get all Instagram accounts for user
  async getAccounts(req, res) {
    try {
      const accounts = await InstagramAccount.find({ userId: req.user._id });
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get single Instagram account
  async getAccount(req, res) {
    try {
      const account = await InstagramAccount.findOne({ 
        _id: req.params.id, 
        userId: req.user._id 
      });
      
      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }
      
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Add new Instagram account
  async addAccount(req, res) {
    try {
      const { instagramId, username, accessToken, refreshToken, profilePic } = req.body;
      
      // Check if account already exists for this user
      const existingAccount = await InstagramAccount.findOne({ 
        instagramId, 
        userId: req.user._id 
      });
      
      if (existingAccount) {
        return res.status(400).json({ error: 'Instagram account already connected' });
      }
      
      const account = new InstagramAccount({
        userId: req.user._id,
        instagramId,
        username,
        accessToken,
        refreshToken,
        profilePic
      });
      
      await account.save();
      res.status(201).json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update Instagram account
  async updateAccount(req, res) {
    try {
      const account = await InstagramAccount.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      
      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }
      
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete Instagram account
  async deleteAccount(req, res) {
    try {
      const account = await InstagramAccount.findOneAndDelete({ 
        _id: req.params.id, 
        userId: req.user._id 
      });
      
      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }
      
      res.json({ message: 'Instagram account removed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Toggle account active status
  async toggleAccountStatus(req, res) {
    try {
      const account = await InstagramAccount.findOne({ 
        _id: req.params.id, 
        userId: req.user._id 
      });
      
      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }
      
      account.isActive = !account.isActive;
      await account.save();
      
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Refresh account tokens
  async refreshAccountTokens(req, res) {
    try {
      const account = await InstagramAccount.findOne({ 
        _id: req.params.id, 
        userId: req.user._id 
      });
      
      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }
      
      // Note: This would require implementing token refresh logic
      // For now, we'll return the current account
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get account analytics
  async getAccountAnalytics(req, res) {
    try {
      const account = await InstagramAccount.findOne({ 
        _id: req.params.id, 
        userId: req.user._id 
      });
      
      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }
      
      // Create Instagram API service with account's access token
      const instagramApi = new InstagramApiService(account.accessToken);
      
      // Get basic account info
      const analytics = {
        accountId: account.instagramId,
        username: account.username,
        isActive: account.isActive,
        connectedAt: account.createdAt,
        lastUpdated: account.updatedAt
      };
      
      // Note: Additional analytics would require Instagram Graph API permissions
      // For now, we'll return basic account info
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get primary account (first active account)
  async getPrimaryAccount(req, res) {
    try {
      const primaryAccount = await InstagramAccount.findOne({ 
        userId: req.user._id,
        isActive: true 
      }).sort({ createdAt: 1 });
      
      if (!primaryAccount) {
        return res.status(404).json({ error: 'No active Instagram account found' });
      }
      
      res.json(primaryAccount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Set account as primary
  async setPrimaryAccount(req, res) {
    try {
      // Deactivate all accounts
      await InstagramAccount.updateMany(
        { userId: req.user._id },
        { isActive: false }
      );
      
      // Activate the selected account
      const account = await InstagramAccount.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { isActive: true },
        { new: true }
      );
      
      if (!account) {
        return res.status(404).json({ error: 'Instagram account not found' });
      }
      
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get account connection status
  async getConnectionStatus(req, res) {
    try {
      const accounts = await InstagramAccount.find({ userId: req.user._id });
      
      const status = {
        totalAccounts: accounts.length,
        activeAccounts: accounts.filter(acc => acc.isActive).length,
        accounts: accounts.map(account => ({
          id: account._id,
          username: account.username,
          isActive: account.isActive,
          connectedAt: account.createdAt
        }))
      };
      
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new InstagramAccountController(); 