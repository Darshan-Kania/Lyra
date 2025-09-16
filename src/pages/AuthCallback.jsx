import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const AuthCallback = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/status`, { withCredentials: true });

      if (response.data.authenticated) {
        navigate('/dashboard', { replace: true });
      } else {
        showAuthFailedPopup();
      }
    } catch (error) {
      showAuthFailedPopup();
    }
  };

  checkAuth();

  function showAuthFailedPopup() {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate('/', { replace: true });
    }, 2000);
  }
}, [navigate]);



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Redirecting...</h1>
      {showPopup && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          Auth failed
        </div>
      )}
    </div>
  );
};

export default AuthCallback;