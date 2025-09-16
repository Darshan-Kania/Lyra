// UI-only auth utility stubs. No backend/API calls.

export const isAuthenticated = () => {
  // Always returns false (UI only)
  return false;
};
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const initiateGoogleLogin = () => {
  window.location.href = `${BACKEND_URL}/auth/google`;
};


export const getCurrentUser = async () => {
  // Returns null (UI only)
  return null;
};