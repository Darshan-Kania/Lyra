import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ReplyModal = ({ isOpen, onClose, email, onSend }) => {
  const [replyBody, setReplyBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReply, setSelectedReply] = useState(null);
  const [showAIReplies, setShowAIReplies] = useState(true);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setReplyBody('');
      setError(null);
      setSelectedReply(null);
      setShowAIReplies(true);
    }
  }, [isOpen]);

  const handleSelectAIReply = (reply) => {
    setSelectedReply(reply);
    setReplyBody(reply.text);
    setShowAIReplies(false);
  };

  const handleWriteMyOwn = () => {
    setSelectedReply(null);
    setReplyBody('');
    setShowAIReplies(false);
  };

  const handleSend = async () => {
    if (!replyBody.trim()) {
      setError('Please enter a reply message');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const result = await onSend(replyBody);
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Failed to send reply');
      }
    } catch (err) {
      setError('Failed to send reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    // Send on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSend();
    }
  };

  if (!email) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Reply to Email</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Email Info */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-20">To:</span>
                    <span className="text-gray-900">{email.sender}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-700 w-20">Subject:</span>
                    <span className="text-gray-900">
                      {email.subject.startsWith('Re: ') ? email.subject : `Re: ${email.subject}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reply Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* AI Reply Options */}
                {showAIReplies && email?.aiReplies && email.aiReplies.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      ✨ AI-Generated Reply Suggestions
                    </h3>
                    <div className="space-y-3">
                      {email.aiReplies.filter(reply => reply && reply.tone && reply.text).map((reply, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => handleSelectAIReply(reply)}
                          className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                              reply.tone === 'Friendly' ? 'bg-green-100 text-green-700' :
                              reply.tone === 'Neutral' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {reply.tone}
                            </span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                            {String(reply.text)}
                          </p>
                        </motion.div>
                      ))}
                      
                      {/* Write My Own Option */}
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        onClick={handleWriteMyOwn}
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">Write My Own Reply</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Text Area (shown when AI replies are hidden or no AI replies available) */}
                {(!showAIReplies || !email?.aiReplies || email.aiReplies.length === 0) && (
                  <>
                    {selectedReply && selectedReply.tone && (
                      <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-indigo-700">
                            Using {String(selectedReply.tone)} tone
                          </span>
                          <button
                            onClick={() => {
                              setShowAIReplies(true);
                              setSelectedReply(null);
                              setReplyBody('');
                            }}
                            className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                          >
                            Choose different reply
                          </button>
                        </div>
                      </div>
                    )}
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your reply here..."
                      className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      autoFocus
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to send
                    </p>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={isSending}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSend}
                  disabled={isSending || !replyBody.trim()}
                  className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Reply
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReplyModal;
