// Settings API methods
import apiClient from './client.js';

export const settingsAPI = {
  updateFilters: async (emailFilters = []) => {
    try {
      const response = await apiClient.post('/updationFilter', { emailFilters });
      return { success: !!response.data?.success, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
