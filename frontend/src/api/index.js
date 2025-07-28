import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
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

// Instagram Accounts
export const getInstagramAccounts = () => api.get('/instagram/accounts');
export const addInstagramAccount = (data) => api.post('/instagram/accounts', data);
export const updateInstagramAccount = (id, data) => api.put(`/instagram/accounts/${id}`, data);
export const deleteInstagramAccount = (id) => api.delete(`/instagram/accounts/${id}`);
export const refreshInstagramAccountTokens = (id) => api.put(`/instagram/accounts/${id}/refresh`);

// Campaigns
export const getCampaigns = () => api.get('/campaigns');
export const getCampaign = (id) => api.get(`/campaigns/${id}`);
export const createCampaign = (data) => api.post('/campaigns', data);
export const updateCampaign = (id, data) => api.put(`/campaigns/${id}`, data);
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}`);

// Automation
export const getAutomations = () => api.get('/automation');
export const getAutomation = (id) => api.get(`/automation/${id}`);
export const createAutomation = (data) => api.post('/automation', data);
export const updateAutomation = (id, data) => api.put(`/automation/${id}`, data);
export const deleteAutomation = (id) => api.delete(`/automation/${id}`);

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data); 

// Authentication
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);
export const getAuthStatus = () => api.get('/auth/status');
export const logout = () => api.post('/auth/logout');
export const logoutAllDevices = () => api.post('/auth/logout-all');
export const getSessionStatus = () => api.get('/auth/session-status');
export const getActiveSessions = () => api.get('/auth/active-sessions');
export const getRecentSessions = () => api.get('/auth/recent-sessions');
export const removeSession = (sessionId) => api.delete(`/auth/sessions/${sessionId}`);

// Instagram OAuth
export const InstagramLogin = () => api.get('/auth/instagram/login');
