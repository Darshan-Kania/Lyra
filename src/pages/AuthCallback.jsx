import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { handleTokenLogin } from '../utils/auth';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing your login...');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let redirectTimer = null;
    
    const processAuth = async () => {
      try {
        // In static mode, we'll just simulate successful authentication
        const userData = await handleTokenLogin("mock-token-from-oauth");
        
        if (!isMounted) return;
        
        if (userData) {
          console.log("AuthCallback: Authentication successful");
          setLocalAuthStatus(true);
          
          if (isMounted) {
            setStatus('Login successful! Redirecting...');
          }
          
          // Wait a moment to ensure state is updated
          redirectTimer = setTimeout(() => {
            if (isMounted) {
              console.log("AuthCallback: Redirecting to dashboard");
              navigate('/dashboard', { replace: true });
            }
          }, 500);
        } else {
          console.log("AuthCallback: Failed to get user data with token");
          setLocalAuthStatus(false);
          
          if (isMounted) {
            setStatus('Authentication failed');
            setError('Failed to authenticate with the server');
            
            // Redirect to landing page after delay
            redirectTimer = setTimeout(() => {
              if (isMounted) {
                navigate('/', { replace: true });
              }
            }, 2000);
          }
        }
            } catch (error) {
        console.error("AuthCallback: Error checking JWT authentication status", error);
        
        if (isMounted) {
          setLocalAuthStatus(false);
          setStatus('Authentication error');
          setError(error.message || 'Failed to complete authentication');
          
          // Redirect to landing page after delay
          redirectTimer = setTimeout(() => {
            if (isMounted) {
              navigate('/', { replace: true });
            }
          }, 2000);
        }
      }
    };

    checkAuthStatus();
    
    return () => {
      isMounted = false;
      // Clear any pending timers
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
    
    checkAuthStatus();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="mb-6">
          {!error ? (
            <motion.div 
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "linear" 
              }}
              className="mx-auto w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
            />
          ) : (
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{status}</h1>
        
        {error && (
          <div className="mt-4 text-red-600 text-sm p-3 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
        
        {error && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium"
            onClick={() => navigate('/')}
          >
            Back to Login
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCallback;
