// API Client Configuration
import axios from 'axios';
import { inc as incLoad, dec as decLoad } from '../utils/loadingBus';

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
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens or common headers here
  incLoad();
    return config;
  },
  (error) => {
  decLoad();
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
  decLoad();
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access - redirect to login');
    }
  decLoad();
    return Promise.reject(error);
  }
);

export default apiClient;
