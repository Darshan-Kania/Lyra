// UI-only auth utility stubs. No backend/API calls.
// This file is now deprecated - use useAuthStore instead

import { authAPI } from "../api";

// Backward compatibility functions - these now use the API abstraction
export const isAuthenticated = async () => {
  const result = await authAPI.checkAuthStatus();
  return result.isAuthenticated;
};

export const initiateGoogleLogin = () => {
  authAPI.initiateGoogleLogin();
};

export const getCurrentUser = async () => {
  const result = await authAPI.getCurrentUser();
  return result.success ? result.user : null;
};

// Note: These functions are deprecated. 
// Use useAuthStore hook for better state management: