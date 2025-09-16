import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const AuthCallback = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/status`, { withCredentials: true });

      if (response.data.authenticated) {
        navigate('/?auth=success', { replace: true });
      } else {
        navigate('/?auth=failed', { replace: true });
      }
    } catch (error) {
      showAuthFailedPopup();
    }
  };

  checkAuth();
}, [navigate]);



  return null;
};

export default AuthCallback;