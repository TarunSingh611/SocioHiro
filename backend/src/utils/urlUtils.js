/**
 * Get the base URL for the application
 * @param {Object} req - Express request object (optional)
 * @returns {string} The base URL
 * 
 * @example
 * // In development: "http://localhost:8080"
 * // In production: "https://yourdomain.com"
 * const baseUrl = getBaseUrl(req);
 */
const getBaseUrl = (req = null) => {
  // If BASE_URL environment variable is set, use it
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  
  // If request object is provided, get from request
  if (req) {
    const protocol = req.protocol;
    const host = req.get('host');
    return `${protocol}://${host}`;
  }
  
  // Fallback for development
  const port = process.env.PORT || 8080;
  return `http://localhost:${port}`;
};

/**
 * Get the origin URL from request headers or fallback
 * @param {Object} req - Express request object
 * @returns {string} The origin URL
 * 
 * @example
 * // Returns the actual origin from request headers
 * // Useful for CORS and redirect URLs
 * const origin = getOriginUrl(req);
 */
const getOriginUrl = (req) => {
  // Try to get from Origin header first
  const origin = req.get('origin');
  if (origin) {
    return origin;
  }
  
  // Fallback to constructing from request
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

/**
 * Get the full URL including path
 * @param {Object} req - Express request object
 * @param {string} path - Additional path (optional)
 * @returns {string} The full URL
 * 
 * @example
 * // Returns: "https://yourdomain.com/api/users/123"
 * const fullUrl = getFullUrl(req, '/api/users/123');
 */
const getFullUrl = (req, path = '') => {
  const baseUrl = getBaseUrl(req);
  const requestPath = req ? req.originalUrl : '';
  const fullPath = path || requestPath;
  
  return `${baseUrl}${fullPath}`;
};

/**
 * Get the API URL
 * @param {Object} req - Express request object (optional)
 * @param {string} endpoint - API endpoint path
 * @returns {string} The API URL
 * 
 * @example
 * // Returns: "https://yourdomain.com/api/auth/instagram"
 * const apiUrl = getApiUrl(req, '/auth/instagram');
 */
const getApiUrl = (req = null, endpoint = '') => {
  const baseUrl = getBaseUrl(req);
  return `${baseUrl}/api${endpoint}`;
};

/**
 * Get the current request URL with query parameters
 * @param {Object} req - Express request object
 * @returns {string} The complete request URL
 * 
 * @example
 * // Returns: "https://yourdomain.com/api/webhooks/instagram?hub.mode=subscribe"
 * const requestUrl = getRequestUrl(req);
 */
const getRequestUrl = (req) => {
  const baseUrl = getBaseUrl(req);
  const fullPath = req.originalUrl;
  return `${baseUrl}${fullPath}`;
};

/**
 * Get the webhook URL for a specific endpoint
 * @param {Object} req - Express request object
 * @param {string} endpoint - Webhook endpoint (e.g., 'instagram', 'facebook')
 * @returns {string} The webhook URL
 * 
 * @example
 * // Returns: "https://yourdomain.com/api/webhooks/instagram"
 * const webhookUrl = getWebhookUrl(req, 'instagram');
 */
const getWebhookUrl = (req, endpoint) => {
  const baseUrl = getBaseUrl(req);
  return `${baseUrl}/api/webhooks/${endpoint}`;
};

module.exports = {
  getBaseUrl,
  getOriginUrl,
  getFullUrl,
  getApiUrl,
  getRequestUrl,
  getWebhookUrl
}; 