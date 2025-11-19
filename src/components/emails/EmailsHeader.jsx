// Emails page header component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { motion } from 'framer-motion';

const EmailsHeader = ({ unreadCount, onCompose }) => {
  const navigate = useNavigate();
  const  authStore  = useAuthStore();
  const userName = authStore.user?.name || 'Guest';

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">
        {userName}'s Inbox
        {unreadCount > 0 && (
          <span className="ml-2 text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
            {unreadCount} unread
          </span>
        )}
      </h1>
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCompose}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Compose
        </motion.button>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="text-sm text-indigo-600 hover:underline transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
    </header>
  );
};

export default EmailsHeader;