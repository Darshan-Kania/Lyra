import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmailSelectors } from '../store/emailsStore';
import { EmailContent } from '../components/emails';

const EmailDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    selectedEmail,
    selectedEmailId,
  isLoading,
  isDetailLoading,
    fetchEmails,
    selectEmail,
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
      </header>
      <main className="flex-grow flex min-h-0">
        <div className="flex-grow">
          <EmailContent selectedEmail={selectedEmail} isLoading={isLoading || isDetailLoading} />
        </div>
      </main>
    </div>
  );
};

export default EmailDetailPage;
