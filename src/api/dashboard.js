// Dashboard/User API methods
import apiClient from './client.js';

export const dashboardAPI = {
  // Get email counts with different filters
  getEmailCount: async (label = null) => {
    try {
      let url = '/dashboard/EmailCount';
      if (label) {
        url += `?label=${label}`;
      }
      const response = await apiClient.get(url);
      return {
        success: true,
        count: response.data.count ?? 0
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        error: error.message
      };
    }
  },

  // Get user's top contacts
  getTopContacts: async () => {
    try {
      const response = await apiClient.get('/dashboard/topContacts');
      return {
        success: true,
        contacts: response.data.contacts || []
      };
    } catch (error) {
      return {
        success: false,
        contacts: [],
        error: error.message
      };
    }
  },

  // Get email activity data (for charts)
  getEmailActivity: async (timeRange = 'week') => {
    try {
      // This endpoint might not exist yet, so we'll provide fallback data
      const response = await apiClient.get(`/dashboard/activity?range=${timeRange}`);
      return {
        success: true,
        activity: response.data.activity || []
      };
    } catch (error) {
      // Return sample data as fallback
      const sampleData = [
        { day: 'Mon', emails: 12 },
        { day: 'Tue', emails: 19 },
        { day: 'Wed', emails: 15 },
        { day: 'Thu', emails: 25 },
        { day: 'Fri', emails: 30 },
        { day: 'Sat', emails: 8 },
        { day: 'Sun', emails: 5 },
      ];
      return {
        success: false,
        activity: sampleData,
        error: error.message
      };
    }
  }
};
