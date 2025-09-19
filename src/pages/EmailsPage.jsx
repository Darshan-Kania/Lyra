import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEmailSelectors } from '../store/emailsStore';
import {
  EmailsHeader,
  EmailSidebar,
  EmailList,
  EmailContent
} from '../components/emails';

const EmailsPage = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const [focusEmailView, setFocusEmailView] = useState(false);
  
  // Zustand email store with selectors
  const {
    paginatedEmails,
    selectedEmail,
    selectedEmailId,
    selectedCategory,
    currentPage,
    totalPages,
    unreadCount,
    isLoading,
    error,
    fetchEmails,
    selectEmail,
    setCategory,
    setPage
  } = useEmailSelectors();

  useEffect(() => {
    // Initialize emails data
    fetchEmails();
  }, [fetchEmails]);

  const handleSelectEmail = (emailId) => {
    // navigate to detail route; EmailDetailPage will select and fetch
    navigate(`/emails/${emailId}`);
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleGoBack = () => {
    if (focusEmailView) {
      setFocusEmailView(false); // exit full email view to list
    } else {
      navigate(-1);
    }
  };

  // Loading state
  if (isLoading && paginatedEmails.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }} 
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" 
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Emails</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => fetchEmails(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <EmailsHeader 
        onGoBack={handleGoBack}
        unreadCount={unreadCount}
      />
      
      <main className="flex-grow flex min-h-0">
        {/* Sidebar toggle button for small screens */}
        <div className="absolute top-24 left-4 z-10 md:hidden">
          <button
            onClick={() => setShowSidebar(s => !s)}
            className="px-3 py-1.5 text-sm rounded-md bg-white border border-gray-300 shadow"
          >
            {showSidebar ? 'Hide menu' : 'Show menu'}
          </button>
        </div>

        {/* Left Sidebar (toggleable) */}
        {showSidebar && (
          <EmailSidebar 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            unreadCount={unreadCount}
            isLoading={isLoading}
          />
        )}

        {/* List-only view here; detail is a separate route */}
        <EmailList 
          emails={paginatedEmails}
          selectedEmailId={selectedEmailId}
          onSelectEmail={handleSelectEmail}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          fullWidth
        />
      </main>
    </div>
  );
};

export default EmailsPage;

