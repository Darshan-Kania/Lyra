// Email Content Display Component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { emailsAPI } from '../../api';

const EmailContent = ({ selectedEmail, isLoading }) => {
  // Log the full selected email object whenever it changes for debugging
  useEffect(() => {
    if (selectedEmail) {
      console.log('[EmailContent] Selected Email:', selectedEmail);
    } else {
      console.log('[EmailContent] No email selected');
    }
  }, [selectedEmail]);

  // Hooks must be called unconditionally and in the same order
  const [sendingId, setSendingId] = useState(null);
  const [sendError, setSendError] = useState(null);

  if (isLoading) {
    return (
      <div className="flex-grow bg-white p-8 overflow-y-auto flex items-center justify-center">
        <div className="text-gray-500">Loading email...</div>
      </div>
    );
  }

  if (!selectedEmail) {
    return (
      <div className="flex-grow bg-white p-8 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">Select an email to read</p>
          <p>Choose an email from the list to view its content</p>
        </div>
      </div>
    );
  }

  const formatEmailDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleSend = async (text) => {
    if (!selectedEmail?.id || !text) return;
    setSendError(null);
    setSendingId(text);
    const res = await emailsAPI.sendReply(selectedEmail.id, text);
    if (!res.success) {
      setSendError('Failed to send. Please try again.');
    }
    setSendingId(null);
  };

  return (
    <div className="flex-grow bg-white p-8 overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedEmail.id} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }} 
          transition={{ duration: 0.2 }}
          className="max-w-4xl"
        >
          {/* Email Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex-grow pr-4">
                {selectedEmail.subject}
              </h1>
              
              {selectedEmail.important && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L13.09 8.26L20 9L15 13.74L16.18 20.02L10 16.77L3.82 20.02L5 13.74L0 9L6.91 8.26L10 2Z" clipRule="evenodd" />
                    </svg>
                    Important
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                  {selectedEmail.sender[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedEmail.sender}</p>
                </div>
              </div>
              
              <div className="ml-auto text-sm text-gray-500">
                {formatEmailDate(selectedEmail.date)}
              </div>
            </div>
          </div>
          
          {/* Email Body */}
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {(() => {
              const bodyContent = selectedEmail.body || selectedEmail.plainbody || '';
              const isHTML = bodyContent.includes('<') && bodyContent.includes('>');
              
              if (isHTML && bodyContent.trim()) {
                // Render HTML content with Tailwind prose styling
                return (
                  <div 
                    dangerouslySetInnerHTML={{ __html: bodyContent }}
                    className="prose prose-gray max-w-none break-words [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full [&_a]:text-indigo-600 [&_a]:underline [&_table]:border-collapse [&_td]:border [&_th]:border [&_td]:p-2 [&_th]:p-2"
                  />
                );
              } else {
                // Fallback to plain text
                return (
                  <div className="whitespace-pre-wrap break-words">
                    {selectedEmail.plainbody || selectedEmail.body || 'No content available'}
                  </div>
                );
              }
            })()}
          </div>

          {/* Summarized Content */}
          {selectedEmail.summary && (
            <div className="mt-6 p-4 border border-indigo-200 bg-indigo-50 rounded-lg">
              <div className="flex items-center mb-2 text-indigo-700 font-semibold">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8m-8 4h5M7 8h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2z" />
                </svg>
                Summarized Content
              </div>
              <p className="text-sm text-indigo-900 whitespace-pre-wrap">{selectedEmail.summary}</p>
            </div>
          )}
          
          {/* AI Replies */}
          {Array.isArray(selectedEmail.aiReplies) && selectedEmail.aiReplies.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 text-sm font-semibold text-gray-700">Quick AI Replies</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selectedEmail.aiReplies.slice(0,3).map((reply, idx) => (
                  <div key={idx} className="p-3 border rounded-md bg-gray-50 flex flex-col">
                    <p className="text-sm text-gray-800 flex-1">{reply}</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(reply)}
                      disabled={sendingId === reply}
                      className="mt-3 inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
                    >
                      {sendingId === reply ? 'Sending…' : 'Send'}
                    </motion.button>
                  </div>
                ))}
              </div>
              {sendError && <p className="mt-2 text-sm text-red-600">{sendError}</p>}
            </div>
          )}

          {/* Email Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reply
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Forward
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EmailContent;
