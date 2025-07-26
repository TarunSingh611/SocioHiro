/**
 * Debug utility for frontend debugging
 */

const isDevelopment = import.meta.env.DEV;
const isDebugEnabled = import.meta.env.VITE_DEBUG === 'true';

class DebugLogger {
  constructor(component) {
    this.component = component;
    this.enabled = isDevelopment && isDebugEnabled;
  }

  log(message, data = null) {
    if (this.enabled) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${this.component}] ${message}`);
      if (data) {
        console.log('Data:', data);
      }
    }
  }

  warn(message, data = null) {
    if (this.enabled) {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] [${this.component}] WARNING: ${message}`);
      if (data) {
        console.warn('Data:', data);
      }
    }
  }

  error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${this.component}] ERROR: ${message}`);
    if (error) {
      console.error('Error details:', error);
    }
  }

  debug(message, data = null) {
    if (this.enabled) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${this.component}] DEBUG: ${message}`);
      if (data) {
        console.log('Debug data:', data);
      }
    }
  }

  // Helper method to log component lifecycle
  logLifecycle(action, props = null) {
    this.log(`Component ${action}`, props);
  }

  // Helper method to log state changes
  logStateChange(oldState, newState) {
    this.log('State changed', { oldState, newState });
  }

  // Helper method to log API calls
  logApiCall(method, url, data = null) {
    this.log(`API ${method} ${url}`, data);
  }

  // Helper method to log API responses
  logApiResponse(status, data = null) {
    this.log(`API Response ${status}`, data);
  }
}

// Create debug logger for different components
const createDebugLogger = (component) => {
  return new DebugLogger(component);
};

// Global debug function
const debug = (message, data = null) => {
  if (isDevelopment && isDebugEnabled) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Debug hook for React components
const useDebug = (componentName) => {
  const logger = createDebugLogger(componentName);

  const logMount = (props = null) => {
    logger.logLifecycle('mounted', props);
  };

  const logUnmount = () => {
    logger.logLifecycle('unmounted');
  };

  const logUpdate = (props = null) => {
    logger.logLifecycle('updated', props);
  };

  const logStateChange = (oldState, newState) => {
    logger.logStateChange(oldState, newState);
  };

  const logApiCall = (method, url, data = null) => {
    logger.logApiCall(method, url, data);
  };

  const logApiResponse = (status, data = null) => {
    logger.logApiResponse(status, data);
  };

  return {
    log: logger.log.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
    debug: logger.debug.bind(logger),
    logMount,
    logUnmount,
    logUpdate,
    logStateChange,
    logApiCall,
    logApiResponse
  };
};

// Debug middleware for API calls
const debugApiMiddleware = (config) => {
  if (isDevelopment && isDebugEnabled) {
    const logger = createDebugLogger('API');
    logger.logApiCall(config.method, config.url, config.data);
  }
  return config;
};

// Debug response interceptor
const debugResponseInterceptor = (response) => {
  if (isDevelopment && isDebugEnabled) {
    const logger = createDebugLogger('API');
    logger.logApiResponse(response.status, response.data);
  }
  return response;
};

// Debug error interceptor
const debugErrorInterceptor = (error) => {
  if (isDevelopment) {
    const logger = createDebugLogger('API');
    logger.error('API Error', error);
  }
  return Promise.reject(error);
};

// Debug Zustand store
const debugStore = (storeName, action, state = null) => {
  if (isDevelopment && isDebugEnabled) {
    const logger = createDebugLogger(`STORE:${storeName}`);
    logger.log(`Action: ${action}`, state);
  }
};

// Debug localStorage operations
const debugStorage = (operation, key, value = null) => {
  if (isDevelopment && isDebugEnabled) {
    const logger = createDebugLogger('STORAGE');
    logger.log(`${operation} ${key}`, value);
  }
};

export {
  createDebugLogger,
  debug,
  useDebug,
  debugApiMiddleware,
  debugResponseInterceptor,
  debugErrorInterceptor,
  debugStore,
  debugStorage,
  DebugLogger
}; 