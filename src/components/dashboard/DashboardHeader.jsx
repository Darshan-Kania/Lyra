// Dashboard Header Component
import React from 'react';

const DashboardHeader = ({ user, onNavigateToEmails }) => {
  const getUserDisplayName = () => {
    if (!user) return '';
    
    if (user.name) {
      return `, ${user.name}`;
    } else if (user.email) {
      return `, ${user.email.split('@')[0]}`;
    }
    return '';
  };

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{getUserDisplayName()}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's an overview of your email activity
        </p>
      </div>
      
      <div className="mt-4 md:mt-0">
        <button
          onClick={onNavigateToEmails}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          View All Emails
  </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
