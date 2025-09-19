// Dashboard Store - Manages dashboard statistics and data
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { dashboardAPI } from '../api';

const useDashboardStore = create(
  persist(
    (set, get) => ({
      // State
      stats: {
        totalEmails: 0,
        unreadEmails: 0,
        importantEmails: 0,
        todaysEmails: 0
      },
      topContacts: [],
      activityData: [],
      selectedTimeRange: 'week',
      isLoading: false,
      error: null,
      lastFetched: null,

  // Actions
  fetchStats: async () => {
    const { lastFetched } = get();
    const now = Date.now();
    
    // Cache for 5 minutes
    if (lastFetched && now - lastFetched < 5 * 60 * 1000) {
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      // Fetch all stats in parallel
      const [totalResult, unreadResult, todaysResult, contactsResult] = await Promise.all([
        dashboardAPI.getEmailCount(),
        dashboardAPI.getEmailCount('unread'),
        dashboardAPI.getEmailCount('today'),
        dashboardAPI.getTopContacts()
      ]);

      const newStats = {
        totalEmails: totalResult.count,
        unreadEmails: unreadResult.count,
        importantEmails: 0, // We'll need to add this endpoint
        todaysEmails: todaysResult.count
      };

      set({
        stats: newStats,
        topContacts: contactsResult.contacts,
        isLoading: false,
        error: null,
        lastFetched: now
      });

    } catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
    }
  },

  fetchActivityData: async (timeRange = null) => {
    const range = timeRange || get().selectedTimeRange;
    set({ isLoading: true, error: null });
    
    try {
      const result = await dashboardAPI.getEmailActivity(range);
      set({
        activityData: result.activity,
        selectedTimeRange: range,
        isLoading: false,
        error: result.error || null
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
    }
  },

  setTimeRange: (timeRange) => {
    set({ selectedTimeRange: timeRange });
    get().fetchActivityData(timeRange);
  },

  // Update individual stat (useful for real-time updates)
  updateStat: (statName, value) => {
    set(state => ({
      stats: {
        ...state.stats,
        [statName]: value
      }
    }));
  },

  // Clear error state
  clearError: () => set({ error: null }),

  // Reset dashboard data
  reset: () => set({
    stats: {
      totalEmails: 0,
      unreadEmails: 0,
      importantEmails: 0,
      todaysEmails: 0
    },
    topContacts: [],
    activityData: [],
    selectedTimeRange: 'week',
    isLoading: false,
    error: null,
    lastFetched: null
  })
}),
{
  name: 'dashboard-storage', // unique name
  storage: createJSONStorage(() => localStorage),
  // Only persist user preferences
  partialize: (state) => ({ 
    selectedTimeRange: state.selectedTimeRange
  }),
}
)
);

export default useDashboardStore;
