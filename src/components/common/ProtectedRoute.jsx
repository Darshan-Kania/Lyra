import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, checkAuthStatus, fetchUser } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run auth check once when component mounts
    const initAuth = async () => {
      if (!hasInitialized.current && !isAuthenticated && !isLoading) {
        hasInitialized.current = true;
        const isAuth = await checkAuthStatus();
        if (isAuth) {
          await fetchUser();
        }
      }
    };
    
    initAuth();
  }, []); // Empty dependency array - only run once on mount

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
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute;
