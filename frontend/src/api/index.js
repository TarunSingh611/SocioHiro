import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 30000, // Increased from 10000 to 30000 (30 seconds)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      const timeoutError = new Error('Request timeout - Instagram API is taking longer than expected. Please try again.');
      timeoutError.isTimeout = true;
      return Promise.reject(timeoutError);
    }
    
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('sociohiro-user');
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Analytics
export const getAnalyticsSummary = () => api.get('/analytics/summary');
export const getAnalyticsOrders = () => api.get('/analytics/orders');
export const getAnalyticsProducts = () => api.get('/analytics/products');
export const getAnalyticsEngagement = () => api.get('/analytics/engagement');
export const getAnalyticsRevenue = () => api.get('/analytics/revenue');
export const getAnalyticsDashboard = () => api.get('/analytics/dashboard');
export const getAnalyticsTimeBased = (timeframe = 'monthly') => api.get('/analytics/time-based', { params: { timeframe } });
export const getAnalyticsComparison = (period1, period2) => api.get('/analytics/comparison', { params: { period1, period2 } });
export const exportAnalytics = (type = 'content', timeframe = 'monthly') => api.get('/analytics/export', { params: { type, timeframe } });

// Instagram Account (Single Account Management)
export const getCurrentInstagramAccount = () => api.get('/instagram-accounts/current');
export const connectInstagramAccount = (data) => api.post('/instagram-accounts/connect', data);
export const disconnectInstagramAccount = () => api.delete('/instagram-accounts/disconnect');
export const refreshInstagramTokens = () => api.post('/instagram-accounts/refresh-tokens');
export const getInstagramConnectionStatus = () => api.get('/instagram-accounts/status');
export const getInstagramAccountAnalytics = () => api.get('/instagram-accounts/analytics');
export const updateInstagramAccountSettings = (data) => api.put('/instagram-accounts/settings', data);

// Campaigns
export const getCampaigns = () => api.get('/campaigns');
export const getCampaign = (id) => api.get(`/campaigns/${id}`);
export const createCampaign = (data) => api.post('/campaigns', data);
export const updateCampaign = (id, data) => api.put(`/campaigns/${id}`, data);
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}`);

// Automation
export const getAutomations = () => api.get('/automation');
export const getAutomationById = (id) => api.get(`/automation/${id}`);
export const createAutomation = (data) => api.post('/automation', data);
export const updateAutomation = (id, data) => api.put(`/automation/${id}`, data);
export const deleteAutomation = (id) => api.delete(`/automation/${id}`);
export const toggleAutomationStatus = (id) => api.patch(`/automation/${id}/toggle`);
export const getAutomationStats = () => api.get('/automation/stats');
export const getAutomationLogs = (filters = {}) => api.get('/automation/logs', { params: filters });
export const testAutomation = (id, testData) => api.post(`/automation/${id}/test`, testData);
export const bulkUpdateAutomations = (automationIds, updates) => api.patch('/automation/bulk/update', { automationIds, updates });
export const bulkDeleteAutomations = (automationIds) => api.delete('/automation/bulk/delete', { data: { automationIds } });
export const exportAutomationTemplate = () => api.get('/automation/template/export');

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data); 

// Authentication
export const getAuthStatus = () => api.get('/auth/status');
export const logout = () => api.post('/auth/logout');
export const logoutAllDevices = () => api.post('/auth/logout-all');
export const getSessionStatus = () => api.get('/auth/session-status');
export const getActiveSessions = () => api.get('/auth/active-sessions');
export const getRecentSessions = () => api.get('/auth/recent-sessions');
export const removeSession = (sessionId) => api.delete(`/auth/sessions/${sessionId}`);

// Instagram OAuth
export const InstagramLogin = () => api.get('/auth/instagram/login');
