// Emails page header component
import React from 'react';
import { useAuthStore } from '../../store';

const EmailsHeader = ({ onGoBack, unreadCount }) => {
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
      <button 
        onClick={onGoBack} 
        className="text-sm text-indigo-600 hover:underline transition-colors"
      >
        ← Back to Dashboard
      </button>
    </header>
  );
};

export default EmailsHeader;