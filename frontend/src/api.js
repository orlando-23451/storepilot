import axios from 'axios';
import { clearSession, getStoredToken } from './utils/session';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api/v1',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
    }
    return Promise.reject(error);
  }
);

const unwrap = async (promise) => {
  const response = await promise;
  return response.data;
};

export const normalizeApiError = (error) => ({
  message:
    error?.response?.data?.message ||
    'No fue posible completar la operación. Intenta de nuevo más tarde.',
  details: error?.response?.data?.details || [],
});

const api = {
  auth: {
    login: (payload) => unwrap(apiClient.post('/auth/login', payload)),
    me: () => unwrap(apiClient.get('/auth/me')),
  },
  dashboard: {
    get: () => unwrap(apiClient.get('/dashboard')),
  },
  users: {
    list: (params) => unwrap(apiClient.get('/users', { params })),
    get: (userId) => unwrap(apiClient.get(`/users/${userId}`)),
    create: (payload) => unwrap(apiClient.post('/users', payload)),
    update: (userId, payload) => unwrap(apiClient.put(`/users/${userId}`, payload)),
    deactivate: (userId) => unwrap(apiClient.delete(`/users/${userId}`)),
  },
  products: {
    list: (params) => unwrap(apiClient.get('/products', { params })),
    get: (productId) => unwrap(apiClient.get(`/products/${productId}`)),
    categories: () => unwrap(apiClient.get('/products/categories')),
    create: (payload) => unwrap(apiClient.post('/products', payload)),
    update: (productId, payload) => unwrap(apiClient.put(`/products/${productId}`, payload)),
    deactivate: (productId) => unwrap(apiClient.delete(`/products/${productId}`)),
  },
  purchases: {
    list: (params) => unwrap(apiClient.get('/purchases', { params })),
    create: (payload) => unwrap(apiClient.post('/purchases', payload)),
  },
  inventory: {
    list: (params) => unwrap(apiClient.get('/inventory', { params })),
    movements: (params) => unwrap(apiClient.get('/inventory/movements', { params })),
  },
  sales: {
    list: (params) => unwrap(apiClient.get('/sales', { params })),
    create: (payload) => unwrap(apiClient.post('/sales', payload)),
  },
  pricing: {
    settings: () => unwrap(apiClient.get('/pricing/settings')),
    suggestions: (params) => unwrap(apiClient.get('/pricing/suggestions', { params })),
    updateSettings: (payload) => unwrap(apiClient.put('/pricing/settings', payload)),
  },
  reports: {
    summary: (params) => unwrap(apiClient.get('/reports/summary', { params })),
  },
};

export default api;
