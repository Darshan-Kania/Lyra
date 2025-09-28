// App initialization hook
import { useEffect } from 'react';
import { useAuthStore } from '../store';

export const useAppInit = () => {
  const { isAuthenticated, checkAuthStatus, fetchUser } = useAuthStore();

  useEffect(() => {
    const initApp = async () => {
      // Check if user is already authenticated (from persisted state)
      if (isAuthenticated) {
        // Verify auth status with server and fetch latest user data
        const stillAuth = await checkAuthStatus();
        if (stillAuth) {
          await fetchUser();
        }
      } else {
        // Try to check auth status (in case user logged in from another tab)
        await checkAuthStatus();
      }
    };

    initApp();
  }, [isAuthenticated, checkAuthStatus, fetchUser]);

  // Note: Dashboard data fetching is handled by individual dashboard components/pages
  // to avoid duplicate API calls

  return { isAuthenticated };
};
