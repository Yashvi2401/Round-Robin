import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios to send credentials with requests
axios.defaults.withCredentials = true;

// Coupon services
export const couponService = {
  // Claim a coupon (no auth required)
  claimCoupon: async () => {
    try {
      const response = await axios.post(`${API_URL}/coupons/claim`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get last claimed coupon and cooldown info
  getLastClaimed: async () => {
    try {
      const response = await axios.get(`${API_URL}/coupons/last-claimed`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all coupons (admin only)
  getCoupons: async () => {
    try {
      const response = await axios.get(`${API_URL}/coupons`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get coupon by ID (admin only)
  getCouponById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/coupons/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new coupon (admin only)
  createCoupon: async (couponData) => {
    try {
      const response = await axios.post(`${API_URL}/coupons`, couponData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update a coupon (admin only)
  updateCoupon: async (id, couponData) => {
    try {
      const response = await axios.put(`${API_URL}/coupons/${id}`, couponData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a coupon (admin only)
  deleteCoupon: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/coupons/${id}`);
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
      const response = await axios.get(`${API_URL}/history`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get claim history by IP (admin only)
  getClaimHistoryByIP: async (ipAddress) => {
    try {
      const response = await axios.get(`${API_URL}/history/ip/${ipAddress}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get claim history by user (admin only)
  getClaimHistoryByUser: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/history/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get claim history by coupon (admin only)
  getClaimHistoryByCoupon: async (couponId) => {
    try {
      const response = await axios.get(`${API_URL}/history/coupon/${couponId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get detailed user coupons (admin only)
  getUserCouponsDetailed: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/history/user/${userId}/detailed`);
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
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user by ID (admin only)
  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user profile (for logged in user)
  getUserProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}; 