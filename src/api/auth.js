// Authentication API methods
import apiClient from './client.js';

export const authAPI = {
  // Check authentication status
  checkAuthStatus: async () => {
    try {
      const response = await apiClient.get('/auth/status');
      return {
        isAuthenticated: response.status === 200 && response.data.authenticated === true,
        data: response.data
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        error: error.message
      };
    }
  },

  // Initiate Google login
  initiateGoogleLogin: () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/dashboard/userProfile');
      // Accept both {success: true, data: {...}} and direct user object
      const userData = response.data && response.data.data ? response.data.data : response.data;
      return {
        success: true,
        user: userData
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        user: null
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await apiClient.patch('/auth/logout');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};
