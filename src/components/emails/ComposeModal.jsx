import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ComposeModal = ({ isOpen, onClose, onSend }) => {
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  });
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',
      });
      setShowCc(false);
      setShowBcc(false);
      setError(null);
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    // Validate required fields
    if (!formData.to.trim()) {
      setError('Please enter at least one recipient');
      return;
    }
    if (!formData.subject.trim()) {
      setError('Please enter a subject');
      return;
    }
    if (!formData.body.trim()) {
      setError('Please enter a message');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const result = await onSend(formData);
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Failed to send email');
      }
    } catch (err) {
      setError('Failed to send email. Please try again.');
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
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">New Message</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-4">
                  {/* To Field */}
                  <div className="flex items-center gap-3">
                    <label className="font-medium text-gray-700 w-20 flex-shrink-0">To:</label>
                    <input
                      type="email"
                      value={formData.to}
                      onChange={(e) => handleChange('to', e.target.value)}
                      placeholder="recipient@example.com"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      {!showCc && (
                        <button
                          onClick={() => setShowCc(true)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Cc
                        </button>
                      )}
                      {!showBcc && (
                        <button
                          onClick={() => setShowBcc(true)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Bcc
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cc Field */}
                  {showCc && (
                    <div className="flex items-center gap-3">
                      <label className="font-medium text-gray-700 w-20 flex-shrink-0">Cc:</label>
                      <input
                        type="email"
                        value={formData.cc}
                        onChange={(e) => handleChange('cc', e.target.value)}
                        placeholder="cc@example.com"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          setShowCc(false);
                          handleChange('cc', '');
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Bcc Field */}
                  {showBcc && (
                    <div className="flex items-center gap-3">
                      <label className="font-medium text-gray-700 w-20 flex-shrink-0">Bcc:</label>
                      <input
                        type="email"
                        value={formData.bcc}
                        onChange={(e) => handleChange('bcc', e.target.value)}
                        placeholder="bcc@example.com"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          setShowBcc(false);
                          handleChange('bcc', '');
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Subject Field */}
                  <div className="flex items-center gap-3">
                    <label className="font-medium text-gray-700 w-20 flex-shrink-0">Subject:</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="Email subject"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Body Field */}
                  <div className="pt-4 border-t border-gray-200">
                    <textarea
                      value={formData.body}
                      onChange={(e) => handleChange('body', e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message here..."
                      className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to send
                    </p>
                  </div>
                </div>
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
                  disabled={isSending || !formData.to.trim() || !formData.subject.trim() || !formData.body.trim()}
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
                      Send Email
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

export default ComposeModal;
