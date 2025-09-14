/**
 * Static auth utilities for MailFlare
 * No backend calls - purely for UI display purposes
 */

// Authentication user profile & token cache keys
const USER_CACHE_KEY = 'mailflare_user';
const TOKEN_CACHE_KEY = 'mailflare_token';

/**
 * Store user profile data in local storage
 * @param {Object} userData - User profile data
 */
export const storeUserData = (userData) => {
  localStorage.setItem(USER_CACHE_KEY, JSON.stringify(userData));
};

/**
 * Get stored user profile data
 * @returns {Object|null} User data or null if not found
 */
export const getUserData = () => {
  const data = localStorage.getItem(USER_CACHE_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Remove user data from local storage
 */
export const clearUserData = () => {
  localStorage.removeItem(USER_CACHE_KEY);
  localStorage.removeItem(TOKEN_CACHE_KEY);
};

/**
 * Store authentication token in local storage
 * @param {string} token - JWT token
 */
export const storeToken = (token) => {
  localStorage.setItem(TOKEN_CACHE_KEY, token);
};

/**
 * Get authentication token from local storage
 * @returns {string|null} Token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_CACHE_KEY);
};

/**
 * Check if user is authenticated (static version - always returns true)
 * @returns {Promise<boolean>} True if authenticated
 */
export const isAuthenticated = async () => {
  return true;
};

/**
 * Get current user (static version - returns mock user)
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async () => {
  const staticUser = {
    id: "1234567890",
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "user"
  };
  
  return staticUser;
};

/**
 * Login user (static version - always succeeds)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const login = async (email, password) => {
  const mockResponse = {
    user: {
      id: "1234567890",
      name: email.split('@')[0],
      email: email,
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "user"
    },
    token: "mock-jwt-token-1234567890"
  };
  
  // Store the data as if it came from a real API
  storeUserData(mockResponse.user);
  storeToken(mockResponse.token);
  
  return mockResponse;
};

/**
 * Register new user (static version - always succeeds)
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User data and token
 */
export const register = async (userData) => {
  const mockResponse = {
    user: {
      id: "1234567890",
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "user"
    },
    token: "mock-jwt-token-1234567890"
  };
  
  // Store the data as if it came from a real API
  storeUserData(mockResponse.user);
  storeToken(mockResponse.token);
  
  return mockResponse;
};

/**
 * Logout user (static version - clears local storage)
 * @returns {Promise<void>}
 */
export const logout = async () => {
  clearUserData();
};

/**
 * Update user profile (static version - always succeeds)
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (userData) => {
  const currentUser = getUserData() || {};
  const updatedUser = { ...currentUser, ...userData };
  
  storeUserData(updatedUser);
  return updatedUser;
};

/**
 * Initiate Google OAuth login flow (static version)
 * This normally would redirect to Google, but we'll just simulate successful login
 */
export const initiateGoogleLogin = () => {
  const mockUser = {
    id: "g-1234567890",
    name: "Google User",
    email: "google.user@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/43.jpg",
    role: "user"
  };
  
  storeUserData(mockUser);
  storeToken("mock-google-token-1234567890");
  
  // Simulate redirect back to the app
  window.location.href = "/";
};

/**
 * Process authentication response (static version)
 * @param {Object} authResponse - Auth response
 * @returns {Object} User data
 */
export const processAuthResponse = (authResponse) => {
  return {
    id: "1234567890",
    name: "Auth Response User",
    email: "auth.response@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    role: "user"
  };
};

/**
 * Handle token login (static version)
 * @returns {Promise<Object>} User data
 */
export const handleTokenLogin = async () => {
  return {
    id: "token-1234567890",
    name: "Token User",
    email: "token.user@example.com", 
    avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    role: "user"
  };
};
