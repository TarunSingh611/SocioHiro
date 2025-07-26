/**
 * Debug utility for backend debugging
 */

const isDevelopment = process.env.NODE_ENV === 'development';

class DebugLogger {
  constructor(module) {
    this.module = module;
    this.enabled = isDevelopment;
  }

  log(message, data = null) {
    if (this.enabled) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${this.module}] ${message}`);
      if (data) {
        console.log('Data:', data);
      }
    }
  }

  warn(message, data = null) {
    if (this.enabled) {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] [${this.module}] WARNING: ${message}`);
      if (data) {
        console.warn('Data:', data);
      }
    }
  }

  error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${this.module}] ERROR: ${message}`);
    if (error) {
      console.error('Error details:', error);
    }
  }

  debug(message, data = null) {
    if (this.enabled && process.env.DEBUG) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${this.module}] DEBUG: ${message}`);
      if (data) {
        console.log('Debug data:', data);
      }
    }
  }

  // Helper method to log API requests
  logRequest(method, path, params = null) {
    this.log(`${method} ${path}`, params);
  }

  // Helper method to log API responses
  logResponse(status, data = null) {
    this.log(`Response ${status}`, data);
  }

  // Helper method to log database operations
  logDb(operation, collection, query = null) {
    this.log(`DB ${operation} on ${collection}`, query);
  }
}

// Create debug logger for different modules
const createDebugLogger = (module) => {
  return new DebugLogger(module);
};

// Global debug function
const debug = (message, data = null) => {
  if (isDevelopment) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Debug middleware for Express
const debugMiddleware = (req, res, next) => {
  if (isDevelopment) {
    const logger = createDebugLogger('HTTP');
    logger.logRequest(req.method, req.path, {
      query: req.query,
      body: req.body,
      headers: req.headers
    });

    // Override res.json to log responses
    const originalJson = res.json;
    res.json = function(data) {
      logger.logResponse(res.statusCode, data);
      return originalJson.call(this, data);
    };
  }
  next();
};

// Debug database operations
const debugDb = (operation, collection, query = null) => {
  if (isDevelopment) {
    const logger = createDebugLogger('DATABASE');
    logger.logDb(operation, collection, query);
  }
};

// Debug authentication
const debugAuth = (action, userId = null) => {
  if (isDevelopment) {
    const logger = createDebugLogger('AUTH');
    logger.log(`Authentication: ${action}`, userId ? { userId } : null);
  }
};

// Debug Instagram API calls
const debugInstagram = (action, data = null) => {
  if (isDevelopment) {
    const logger = createDebugLogger('INSTAGRAM');
    logger.log(`Instagram API: ${action}`, data);
  }
};

module.exports = {
  createDebugLogger,
  debug,
  debugMiddleware,
  debugDb,
  debugAuth,
  debugInstagram,
  DebugLogger
}; 