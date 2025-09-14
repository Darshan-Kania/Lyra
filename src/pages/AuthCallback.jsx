import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { handleOAuthCallback } from '../utils/auth';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing your login...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const processAuth = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      
      if (error) {
        setStatus('Authentication failed');
        setError(error);
        return;
      }
      
      if (!code) {
        setStatus('Missing authentication code');
        setError('No authorization code provided');
        return;
      }
      
      try {
        setStatus('Verifying your account...');
        await handleOAuthCallback(code);
        setStatus('Login successful! Redirecting...');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } catch (err) {
        setStatus('Authentication failed');
        setError(err.message || 'Failed to authenticate');
      }
    };
    
    processAuth();
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
