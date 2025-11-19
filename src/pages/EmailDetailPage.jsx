import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmailSelectors } from '../store/emailsStore';
import { EmailContent, ComposeModal } from '../components/emails';
import { motion } from 'framer-motion';

const EmailDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  const {
    selectedEmail,
    selectedEmailId,
  isLoading,
  isDetailLoading,
    fetchEmails,
    selectEmail,
    composeEmail,
  } = useEmailSelectors();

  // Ensure list exists and select this email id; store will fetch by id
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  useEffect(() => {
    if (id && selectedEmailId !== id) {
      selectEmail(id);
    }
  }, [id, selectedEmailId, selectEmail]);

  const handleBack = () => navigate('/emails');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="flex-shrink-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <button onClick={handleBack} className="text-sm text-indigo-600 hover:underline">← Back to list</button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsComposeModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Compose
        </motion.button>
      </header>
      <main className="flex-grow flex min-h-0">
        <div className="flex-grow">
          <EmailContent selectedEmail={selectedEmail} isLoading={isLoading || isDetailLoading} />
        </div>
      </main>

      {/* Compose Modal */}
      <ComposeModal
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        onSend={async (emailData) => {
          const result = await composeEmail(emailData);
          if (result.success) {
            // Refresh emails after sending
            await fetchEmails(true);
          }
          return result;
        }}
      />
    </div>
  );
};

export default EmailDetailPage;
