// Auth Store - Manages authentication state and user data
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI } from '../api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
      _activeRequests: new Set(), // Track active API requests

      // Actions
      checkAuthStatus: async () => {
        const { _activeRequests } = get();
        
        // Prevent duplicate requests
        if (_activeRequests.has('checkAuthStatus')) {
          return get().isAuthenticated;
        }
        
        _activeRequests.add('checkAuthStatus');
        set({ isLoading: true, error: null });
        
        try {
          const result = await authAPI.checkAuthStatus();
          set({ 
            isAuthenticated: result.isAuthenticated,
            isLoading: false,
            error: result.error || null
          });
          return result.isAuthenticated;
        } catch (error) {
          set({ 
            isAuthenticated: false,
            isLoading: false,
            error: error.message
          });
          return false;
        } finally {
          _activeRequests.delete('checkAuthStatus');
        }
      },

  fetchUser: async () => {
    const { _activeRequests, user } = get();
    
    // Return cached user if already exists
    if (user) {
      return { success: true, user };
    }
    
    // Prevent duplicate requests
    if (_activeRequests.has('fetchUser')) {
      return { success: false, error: 'Request in progress' };
    }
    
    _activeRequests.add('fetchUser');
    set({ isLoading: true, error: null });
    
    try {
      const result = await authAPI.getCurrentUser();
      if (result.success) {
        set({ 
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: result.error
        });
      }
      return result;
    } catch (error) {
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message
      });
      return { success: false, error: error.message };
    } finally {
      _activeRequests.delete('fetchUser');
    }
  },

  initiateGoogleLogin: () => {
    authAPI.initiateGoogleLogin();
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const result = await authAPI.logout();
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
      return result;
    } catch (error) {
      set({ 
        isLoading: false,
        error: error.message
      });
      return { success: false, error: error.message };
    }
  },

  // Clear error state
  clearError: () => set({ error: null }),

  // Reset auth state (useful for testing or forced logout)
  resetAuth: () => set({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null
  })
}),
{
  name: 'auth-storage', // unique name
  storage: createJSONStorage(() => localStorage),
  // Only persist essential auth data, not loading states, errors, or active requests
  partialize: (state) => ({ 
    isAuthenticated: state.isAuthenticated,
    user: state.user
  }),
}
)
);

export default useAuthStore;
