// Email List Sidebar Component
import React from 'react';
import { motion } from 'framer-motion';

const EmailItem = ({ email, onSelect, isSelected }) => {
  const formatEmailDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Function to strip HTML tags and get clean text preview
  const getTextPreview = (htmlContent, plainContent) => {
    // If we have HTML content, strip the tags
    if (htmlContent && htmlContent.trim()) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Remove style and script tags completely
      const styleTags = tempDiv.querySelectorAll('style, script');
      styleTags.forEach(tag => tag.remove());
      
      // Get clean text content
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      // Clean up extra whitespace and return first 150 characters
      const cleanText = textContent.replace(/\s+/g, ' ').trim();
      return cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText;
    }
    // Fallback to plain content
    return plainContent || 'No preview available';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ backgroundColor: '#f9fafb' }}
      onClick={() => onSelect(email.id)}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-indigo-100' 
          : email.read 
            ? 'bg-white' 
            : 'bg-blue-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${
            email.read ? 'bg-transparent' : 'bg-blue-600'
          }`}></div>
          <div className="flex items-center gap-2">
            {email.isSent && (
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <p className="font-semibold text-sm truncate">
              {email.isSent ? `To: ${email.sender}` : email.sender}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 flex-shrink-0">
          {formatEmailDate(email.date)}
        </p>
      </div>
      <p className="mt-1 font-medium text-sm text-gray-800 truncate">
        {email.subject}
      </p>
      <p className="mt-1 text-sm text-gray-600 truncate">
        {getTextPreview(email.body, email.plainbody)}
      </p>
    </motion.div>
  );
};

const EmailSidebar = ({ 
  selectedCategory,
  onCategoryChange,
  unreadCount
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Compose Button */}
      <div className="p-4">
        <motion.button 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.97 }} 
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium shadow hover:bg-indigo-700 transition-colors"
        >
          Compose
        </motion.button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-grow p-2">
        <button 
          onClick={() => onCategoryChange('inbox')} 
          className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center space-x-3 text-sm font-medium transition-colors ${
            selectedCategory === 'inbox' 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <span>Inbox</span>
          {unreadCount > 0 && (
            <span className="bg-indigo-600 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-auto">
              {unreadCount}
            </span>
          )}
        </button>
        
        <button 
          onClick={() => onCategoryChange('important')} 
          className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center space-x-3 text-sm font-medium transition-colors ${
            selectedCategory === 'important' 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span>Important</span>
        </button>
        
        <button 
          onClick={() => onCategoryChange('sent')} 
          className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center space-x-3 text-sm font-medium transition-colors ${
            selectedCategory === 'sent' 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span>Sent</span>
        </button>
      </nav>
    </div>
  );
};

const EmailList = ({ 
  emails, 
  selectedEmailId, 
  onSelectEmail, 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading,
  fullWidth = false
}) => {
  if (isLoading) {
    return (
      <div className={`${fullWidth ? 'flex-1 w-full' : 'w-96'} bg-white ${fullWidth ? '' : 'border-r border-gray-200'} flex items-center justify-center`}>
        <div className="text-gray-500">Loading emails...</div>
      </div>
    );
  }

  return (
    <div className={`${fullWidth ? 'flex-1 w-full' : 'w-96'} bg-white ${fullWidth ? '' : 'border-r border-gray-200'} flex flex-col ${fullWidth ? '' : 'flex-shrink-0'}`}>
      <div className="flex-grow overflow-y-auto">
        {emails.map(email => (
          <EmailItem 
            key={email.id} 
            email={email} 
            onSelect={onSelectEmail} 
            isSelected={selectedEmailId === email.id} 
          />
        ))}
      </div>
      
      {/* Pagination Controls */}
      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)} 
          className="px-3 py-1 border border-gray-300 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Prev
        </motion.button>
        
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages} ({emails.length} emails)
        </span>
        
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          disabled={currentPage === totalPages} 
          onClick={() => onPageChange(currentPage + 1)} 
          className="px-3 py-1 border border-gray-300 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
};

export { EmailSidebar, EmailList };
