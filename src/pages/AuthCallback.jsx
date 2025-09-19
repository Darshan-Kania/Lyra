import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await checkAuthStatus();
        
        if (isAuthenticated) {
          navigate('/?auth=success', { replace: true });
        } else {
          navigate('/?auth=failed', { replace: true });
        }
      } catch (error) {
        navigate('/?auth=failed', { replace: true });
      }
    };

    checkAuth();
  }, [navigate, checkAuthStatus]);



  return null;
};

export default AuthCallback;