import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to automatically add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Coupon services
export const couponService = {
  // Claim a coupon (no auth required)
  claimCoupon: async () => {
    try {
      const response = await api.post('/coupons/claim');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get last claimed coupon and cooldown info
  getLastClaimed: async () => {
    try {
      const response = await api.get('/coupons/last-claimed');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all coupons (admin only)
  getCoupons: async () => {
    try {
      const response = await api.get('/coupons');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get coupon by ID (admin only)
  getCouponById: async (id) => {
    try {
      const response = await api.get(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new coupon (admin only)
  createCoupon: async (couponData) => {
    try {
      const response = await api.post('/coupons', couponData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update a coupon (admin only)
  updateCoupon: async (id, couponData) => {
    try {
      const response = await api.put(`/coupons/${id}`, couponData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a coupon (admin only)
  deleteCoupon: async (id) => {
    try {
      const response = await api.delete(`/coupons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Claim history services
export const historyService = {
  // Get all claim history (admin only)
  getClaimHistory: async () => {
    try {
      const response = await api.get('/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get claim history by IP (admin only)
  getClaimHistoryByIP: async (ipAddress) => {
    try {
      const response = await api.get(`/history/ip/${ipAddress}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get claim history by user (admin only)
  getClaimHistoryByUser: async (userId) => {
    try {
      const response = await api.get(`/history/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get claim history by coupon (admin only)
  getClaimHistoryByCoupon: async (couponId) => {
    try {
      const response = await api.get(`/history/coupon/${couponId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get detailed user coupons (admin only)
  getUserCouponsDetailed: async (userId) => {
    try {
      const response = await api.get(`/history/user/${userId}/detailed`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// User services
export const userService = {
  // Get all users (admin only)
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user by ID (admin only)
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user profile (for logged in user)
  getUserProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};