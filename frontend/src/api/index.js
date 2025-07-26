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

// Orders
export const getOrders = () => api.get('/orders');
export const getRecentOrders = (limit = 5) => api.get(`/orders/recent?limit=${limit}`);
export const updateOrderStatus = (orderId, status) => api.put(`/orders/${orderId}/status`, { status });
export const syncOrdersFromInstagram = () => api.get('/orders/sync/from-instagram');

// Products
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const syncProductToInstagram = (id) => api.post(`/products/${id}/sync`);

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