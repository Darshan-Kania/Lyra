// API Client Configuration
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  // Add any auth tokens or common headers here
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error cases centrally as needed
    return Promise.reject(error);
  }
);

export default apiClient;
