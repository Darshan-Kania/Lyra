// Auth Store - Manages authentication state and user data
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI } from '../api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      isAuthenticated: false,
  isLoading: false, // backward-compatible aggregate
  isAuthLoading: false,
  isUserLoading: false,
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
        set((state) => ({ isAuthLoading: true, isLoading: true, error: null }));
        
        try {
          const result = await authAPI.checkAuthStatus();
          set((state) => ({ 
            isAuthenticated: result.isAuthenticated,
            isAuthLoading: false,
            isLoading: state.isUserLoading || false,
            error: result.error || null
          }));
          return result.isAuthenticated;
        } catch (error) {
          set((state) => ({ 
            isAuthenticated: false,
            isAuthLoading: false,
            isLoading: state.isUserLoading || false,
            error: error.message
          }));
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
    set((state) => ({ isUserLoading: true, isLoading: true, error: null }));
    
    try {
      const result = await authAPI.getCurrentUser();
      if (result.success) {
        set((state) => ({ 
          user: result.user,
          isAuthenticated: true,
          isUserLoading: false,
          isLoading: state.isAuthLoading || false,
          error: null
        }));
      } else {
        set((state) => ({ 
          user: null,
          isAuthenticated: false,
          isUserLoading: false,
          isLoading: state.isAuthLoading || false,
          error: result.error
        }));
      }
      return result;
    } catch (error) {
      set((state) => ({ 
        user: null,
        isAuthenticated: false,
        isUserLoading: false,
        isLoading: state.isAuthLoading || false,
        error: error.message
      }));
      return { success: false, error: error.message };
    } finally {
      _activeRequests.delete('fetchUser');
    }
  },

  initiateGoogleLogin: () => {
    authAPI.initiateGoogleLogin();
  },

  logout: async () => {
    set({ isLoading: true, isAuthLoading: true });
    try {
      const result = await authAPI.logout();
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isAuthLoading: false,
        isUserLoading: false,
        error: null
      });
      return result;
    } catch (error) {
      set({ 
        isLoading: false,
        isAuthLoading: false,
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
    isAuthLoading: false,
    isUserLoading: false,
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
