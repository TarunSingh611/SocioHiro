const express = require('express');
const router = express.Router();

// Instagram Graph API Webhook Handler
class InstagramWebhookHandler {
  constructor() {
    this.verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || 'SocioHiroSuperSecretWebhookVerifyToken2025';
  }

  // Handle webhook verification (GET request)
  handleVerification(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Webhook verification request:', {
      mode,
      token,
      challenge,
      expectedToken: this.verifyToken
    });

    // Check if mode and token are correct
    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('Webhook verification failed');
      res.status(403).send('Forbidden');
    }
  }

  // Handle incoming webhook events (POST request)
  handleWebhook(req, res) {
    const body = req.body;

    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // Check if this is a page webhook
    if (body.object === 'page') {
      body.entry.forEach(entry => {
        // Handle page events
        if (entry.messaging) {
          entry.messaging.forEach(event => {
            this.handleMessagingEvent(event);
          });
        }

        // Handle Instagram events
        if (entry.instagram) {
          entry.instagram.forEach(event => {
            this.handleInstagramEvent(event);
          });
        }
      });

      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.status(404).send('Not Found');
    }
  }

  // Handle Instagram-specific events
  handleInstagramEvent(event) {
    console.log('Instagram event received:', event);

    switch (event.type) {
      case 'mention':
        this.handleMention(event);
        break;
      case 'comment':
        this.handleComment(event);
        break;
      case 'like':
        this.handleLike(event);
        break;
      case 'story_insights':
        this.handleStoryInsights(event);
        break;
      case 'media':
        this.handleMediaEvent(event);
        break;
      default:
        console.log('Unknown Instagram event type:', event.type);
    }
  }

  // Handle messaging events (for future DM support)
  handleMessagingEvent(event) {
    console.log('Messaging event received:', event);
    // Future implementation for DM handling
  }

  // Handle Instagram mentions
  handleMention(event) {
    console.log('Instagram mention:', event);
    // TODO: Implement mention handling
    // - Store mention in database
    // - Send notification to user
    // - Trigger automated response if configured
  }

  // Handle Instagram comments
  handleComment(event) {
    console.log('Instagram comment:', event);
    // TODO: Implement comment handling
    // - Store comment in database
    // - Send notification to user
    // - Trigger automated response if configured
  }

  // Handle Instagram likes
  handleLike(event) {
    console.log('Instagram like:', event);
    // TODO: Implement like handling
    // - Update engagement metrics
    // - Store interaction data
  }

  // Handle story insights
  handleStoryInsights(event) {
    console.log('Story insights:', event);
    // TODO: Implement insights handling
    // - Update analytics data
    // - Store metrics
  }

  // Handle media events
  handleMediaEvent(event) {
    console.log('Media event:', event);
    // TODO: Implement media event handling
    // - Update post data
    // - Store engagement metrics
  }
}

const webhookHandler = new InstagramWebhookHandler();

// Webhook verification endpoint (GET)
router.get('/instagram', (req, res) => {
  webhookHandler.handleVerification(req, res);
});

// Webhook event endpoint (POST)
router.post('/instagram', express.json({ verify: false }), (req, res) => {
  webhookHandler.handleWebhook(req, res);
});

module.exports = router; 