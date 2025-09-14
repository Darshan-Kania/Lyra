import axios from 'axios';

// Constants
const API_URL = 'http://localhost:8000'; // Make sure this matches your backend server URL

// Authentication State Management
const AUTH_STORAGE_KEY = 'mailflare_auth';

/**
 * Store authentication data in local storage
 * @param {Object} authData - Authentication data received from the backend
 */
export const storeAuthData = (authData) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
};

/**
 * Get stored authentication data
 * @returns {Object|null} Authentication data or null if not found
 */
export const getAuthData = () => {
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Remove authentication data from local storage
 */
export const clearAuthData = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid auth data
 */
export const isAuthenticated = () => {
  const authData = getAuthData();
  if (!authData || !authData.accessToken) return false;
  
  // Optional: Check token expiration if your backend provides expiry
  if (authData.expiresAt && new Date(authData.expiresAt) < new Date()) {
    clearAuthData();
    return false;
  }
  
  return true;
};

/**
 * Initiate Google OAuth login flow
 */
export const initiateGoogleLogin = () => {
  // Redirect to backend OAuth endpoint
  window.location.href = `${API_URL}/auth/google`;
};

/**
 * Handle OAuth callback from backend
 * @param {string} authCode - Authorization code or token from the query params
 * @returns {Promise} Promise resolving to user data
 */
export const handleOAuthCallback = async (authCode) => {
  try {
    // Exchange auth code for tokens
    const response = await axios.post(`${API_URL}/auth/callback`, { code: authCode });
    
    if (response.data && response.data.accessToken) {
      storeAuthData(response.data);
      return response.data.user;
    }
    
    throw new Error('Invalid authentication response');
  } catch (error) {
    console.error('OAuth callback error:', error);
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logout = () => {
  clearAuthData();
  // Optionally notify backend about logout
  axios.post(`${API_URL}/auth/logout`).catch(err => {
    console.error('Logout error:', err);
  });
};

/**
 * Get the current authenticated user profile
 * @returns {Promise} Promise resolving to user data
 */
export const getCurrentUser = async () => {
  if (!isAuthenticated()) {
    return null;
  }
  
  try {
    const authData = getAuthData();
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      clearAuthData();
    }
    console.error('Failed to get current user:', error);
    return null;
  }
};

// Axios interceptor to add authentication token to requests
axios.interceptors.request.use(
  (config) => {
    const authData = getAuthData();
    if (authData && authData.accessToken) {
      config.headers.Authorization = `Bearer ${authData.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
