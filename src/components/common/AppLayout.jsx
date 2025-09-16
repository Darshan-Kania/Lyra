import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { a } from 'framer-motion/client';

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine active link
  const isActive = (path) => {
    return location.pathname === path;
  };
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const handleLogout = async () => {
  console.log('Logging out...');

  try {
    await axios.patch(`${BACKEND_URL}/auth/logout`, {}, {
      withCredentials: true  // ✅ This is crucial for cookies
    });

    console.log('Logged out successfully on server');
  } catch (error) {
    console.error('Error logging out:', error);
    // Proceed anyway
  }
  navigate('/', { replace: true });  // Redirect to home
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/dashboard" className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600">MailFlare</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/emails"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isActive('/emails')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Emails
                </Link>

                <Link
                  to="/settings"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    isActive('/settings')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Settings
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg"
                >
                  Logout
                </motion.button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Menu icon */}
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/emails"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/emails')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Emails
            </Link>

            <Link
              to="/settings"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/settings')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
