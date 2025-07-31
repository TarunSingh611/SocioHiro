/**
 * Example usage of URL utility functions
 * This file demonstrates how to use the urlUtils functions in different scenarios
 */

const { 
  getBaseUrl, 
  getOriginUrl, 
  getFullUrl, 
  getApiUrl, 
  getRequestUrl, 
  getWebhookUrl 
} = require('./urlUtils');

// Example 1: Getting base URL in different contexts
const exampleBaseUrl = () => {
  // In a route handler
  app.get('/api/example', (req, res) => {
    const baseUrl = getBaseUrl(req);
    console.log('Base URL:', baseUrl); // "https://yourdomain.com" or "http://localhost:8080"
    
    // Without request object (for background jobs)
    const fallbackUrl = getBaseUrl();
    console.log('Fallback URL:', fallbackUrl); // "http://localhost:8080"
  });
};

// Example 2: Getting origin URL for CORS
const exampleOriginUrl = () => {
  app.get('/api/cors-example', (req, res) => {
    const origin = getOriginUrl(req);
    console.log('Origin:', origin); // "https://yourdomain.com" or "http://localhost:8080"
    
    // Use for CORS configuration
    res.header('Access-Control-Allow-Origin', origin);
    res.json({ message: 'CORS configured' });
  });
};

// Example 3: Building API URLs
const exampleApiUrls = () => {
  app.get('/api/build-urls', (req, res) => {
    const authUrl = getApiUrl(req, '/auth/instagram');
    const webhookUrl = getWebhookUrl(req, 'instagram');
    const fullUrl = getFullUrl(req, '/api/users/123');
    
    res.json({
      authUrl,        // "https://yourdomain.com/api/auth/instagram"
      webhookUrl,     // "https://yourdomain.com/api/webhooks/instagram"
      fullUrl         // "https://yourdomain.com/api/users/123"
    });
  });
};

// Example 4: Using in Instagram OAuth callback
const exampleOAuthCallback = () => {
  app.get('/api/auth/instagram/callback', (req, res) => {
    const redirectUrl = getBaseUrl(req) + '/dashboard';
    console.log('Redirect to:', redirectUrl); // "https://yourdomain.com/dashboard"
    
    // Redirect user after OAuth
    res.redirect(redirectUrl);
  });
};

// Example 5: Using in webhook configuration
const exampleWebhookConfig = () => {
  app.get('/api/webhook-config', (req, res) => {
    const config = {
      verifyToken: process.env.WEBHOOK_VERIFY_TOKEN,
      callbackUrl: getWebhookUrl(req, 'instagram'),
      originUrl: getOriginUrl(req),
      baseUrl: getBaseUrl(req)
    };
    
    res.json(config);
  });
};

// Example 6: Using in email templates
const exampleEmailUrls = () => {
  app.post('/api/send-email', (req, res) => {
    const baseUrl = getBaseUrl(req);
    const emailData = {
      resetUrl: `${baseUrl}/reset-password?token=${token}`,
      verifyUrl: `${baseUrl}/verify-email?token=${token}`,
      dashboardUrl: `${baseUrl}/dashboard`
    };
    
    // Send email with URLs
    console.log('Email URLs:', emailData);
  });
};

// Example 7: Using in logging
const exampleLogging = () => {
  app.use((req, res, next) => {
    const requestUrl = getRequestUrl(req);
    console.log(`Request to: ${requestUrl}`);
    next();
  });
};

module.exports = {
  exampleBaseUrl,
  exampleOriginUrl,
  exampleApiUrls,
  exampleOAuthCallback,
  exampleWebhookConfig,
  exampleEmailUrls,
  exampleLogging
}; 