// UI-only auth utility stubs. No backend/API calls.

import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const isAuthenticated = async () => {
  const res= await axios.get(`${BACKEND_URL}/auth/status`, { withCredentials: true });
  if(res.status===200&&res.data.authenticated === true){
    return true;
  }
  return false;
};

export const initiateGoogleLogin = () => {
  window.location.href = `${BACKEND_URL}/auth/google`;
};


export const getCurrentUser = async () => {
  // Returns null (UI only)
  return null;
};