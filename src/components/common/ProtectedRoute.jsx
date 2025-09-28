import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, checkAuthStatus, fetchUser } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    let isMounted = true;
    
    // Only run auth check once when component mounts
    const initAuth = async () => {
      if (!hasInitialized.current && !isAuthenticated && !isLoading && isMounted) {
        hasInitialized.current = true;
        const isAuth = await checkAuthStatus();
        if (isAuth && isMounted) {
          await fetchUser();
        }
      }
    };
    
    initAuth();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/?auth=required" state={{ from: location }} replace />;
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;
