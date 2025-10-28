// Settings API methods
import apiClient from './client.js';

export const settingsAPI = {
  getFilters: async () => {
    try {
      const response = await apiClient.get('/dashboard/filters');
      return { success: !!response.data?.success, data: response.data?.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  updateFilters: async (emailFilters = []) => {
    try {
      const response = await apiClient.post('/dashboard/updateFilters', { emailFilters });
      return { success: !!response.data?.success, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
