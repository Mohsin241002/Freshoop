import axios from 'axios';
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache session for fast synchronous access
let currentSession = null;

// Initialize session
supabase.auth.getSession().then(({ data: { session } }) => {
  currentSession = session;
});

// Update session on auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  currentSession = session;
});

// Synchronous interceptor using cached session
api.interceptors.request.use(async (config) => {
  // Try to get fresh session if currentSession is null
  if (!currentSession) {
    const { data: { session } } = await supabase.auth.getSession();
    currentSession = session;
  }
  
  if (currentSession?.access_token) {
    config.headers.Authorization = `Bearer ${currentSession.access_token}`;
  }
  return config;
});

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Items API
export const itemsApi = {
  getAll: (categoryId) => api.get('/items', { params: { category_id: categoryId } }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
};

// Cart API (uses authentication, no userId in URL)
export const cartApi = {
  get: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (cartItemId, data) => api.put(`/cart/items/${cartItemId}`, data),
  removeItem: (cartItemId) => api.delete(`/cart/items/${cartItemId}`),
  clear: () => api.delete('/cart'),
};

// Orders API
export const ordersApi = {
  checkout: () => api.post('/orders/checkout'),
  getUserOrders: () => api.get('/orders'),
  getByOrderNumber: (orderNumber) => api.get(`/orders/${orderNumber}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// Users API
export const usersApi = {
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
};

export default api;

