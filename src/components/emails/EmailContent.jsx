// Email Content Display Component
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmailsStore from '../../store/emailsStore.js';
import ReplyModal from './ReplyModal.jsx';

const EmailContent = ({ selectedEmail, isLoading }) => {
  // Keep component pure and quiet in production

  // Hooks must be called unconditionally and in the same order
  const [sendingId, setSendingId] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const sendReply = useEmailsStore(s => s.sendReply);

  if (isLoading) {
    return (
      <div className="flex-grow bg-white p-8 overflow-y-auto flex items-center justify-center">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
          />
          <p className="mt-4 text-sm text-gray-500">Loading email…</p>
        </div>
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
    const res = await sendReply(selectedEmail.id, text);
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
              
              <div className="flex gap-2 items-center">
                {/* Important Star Button - Only for inbox emails */}
                {!selectedEmail.isSent && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={async () => {
                      const newImportant = !selectedEmail.important;
                      // Optimistically update UI
                      const { markAsImportant } = useEmailsStore.getState();
                      await markAsImportant(selectedEmail.id, newImportant);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title={selectedEmail.important ? "Remove from important" : "Mark as important"}
                  >
                    <svg 
                      className={`w-6 h-6 ${selectedEmail.important ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}`}
                      fill={selectedEmail.important ? 'currentColor' : 'none'}
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth={selectedEmail.important ? 0 : 2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </motion.button>
                )}
                
                {selectedEmail.isSent && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sent
                  </span>
                )}
                {selectedEmail.important && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L13.09 8.26L20 9L15 13.74L16.18 20.02L10 16.77L3.82 20.02L5 13.74L0 9L6.91 8.26L10 2Z" clipRule="evenodd" />
                    </svg>
                    Important
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                  {selectedEmail.sender[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{selectedEmail.isSent ? 'To:' : 'From:'}</p>
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
          {Array.isArray(selectedEmail.aiReplies) && selectedEmail.aiReplies.length > 0 && (() => {
            // Filter and normalize replies - handle both old format (strings) and new format (objects)
            const validReplies = selectedEmail.aiReplies
              .filter(reply => {
                // New format: {tone, text}
                if (typeof reply === 'object' && reply !== null && reply.tone && reply.text) {
                  return true;
                }
                // Old format: just strings (for backward compatibility)
                if (typeof reply === 'string') {
                  return true;
                }
                return false;
              })
              .slice(0, 3);
            
            if (validReplies.length === 0) return null;
            
            return (
              <div className="mt-6">
                <div className="mb-3 text-sm font-semibold text-gray-700">Quick AI Replies</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {validReplies.map((reply, idx) => {
                    // Normalize to new format
                    const isNewFormat = typeof reply === 'object' && reply !== null;
                    const tone = isNewFormat ? reply.tone : 'Neutral';
                    const text = isNewFormat ? reply.text : reply;
                    
                    return (
                      <div key={idx} className="p-3 border rounded-md bg-gray-50 flex flex-col">
                        {isNewFormat && (
                          <div className="mb-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              tone === 'Friendly' ? 'bg-green-100 text-green-700' :
                              tone === 'Neutral' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {tone}
                            </span>
                          </div>
                        )}
                        <p className="text-sm text-gray-800 flex-1 line-clamp-3">{String(text)}</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSend(String(text))}
                          disabled={sendingId === String(text)}
                          className="mt-3 inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
                        >
                          {sendingId === String(text) ? 'Sending…' : 'Send'}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
                {sendError && <p className="mt-2 text-sm text-red-600">{sendError}</p>}
              </div>
            );
          })()}

          {/* Email Actions - Hide for sent emails */}
          {!selectedEmail.isSent && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsReplyModalOpen(true)}
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
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Reply Modal */}
      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        email={selectedEmail}
        onSend={async (body) => {
          const result = await sendReply(selectedEmail.id, body);
          return result;
        }}
      />
    </div>
  );
};

export default EmailContent;
