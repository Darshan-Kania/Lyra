import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Start of Data Generation ---

const generateSampleEmails = () => {
  const baseEmails = [
    { id: '1', sender: 'GitHub', senderEmail: 'noreply@github.com', subject: 'Your daily digest', body: 'Check out what happened in your repositories today. There were 15 new issues, 3 pull requests, and 8 comments.', date: new Date().toISOString(), read: false, important: true },
    { id: '2', sender: 'Product Team', senderEmail: 'product@company.com', subject: 'New feature release: AI Summaries', body: 'We are excited to announce our latest feature that uses AI to summarize long email threads. Try it out now and let us know what you think!', date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), read: true, important: false },
    { id: '3', sender: 'LinkedIn', senderEmail: 'notifications@linkedin.com', subject: 'You have 5 new connection requests', body: 'Expand your network with these professionals who have requested to connect with you. View their profiles and decide whether to accept.', date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), read: true, important: false },
    { id: '4', sender: 'AWS', senderEmail: 'no-reply@aws.amazon.com', subject: 'Your monthly AWS bill is now available', body: 'Your AWS bill for the month of September is now available for viewing and payment. The total amount due is $42.50.', date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), read: false, important: true },
    { id: '5', sender: 'Design Team', senderEmail: 'design@company.com', subject: 'Design review for MailFlare Dashboard', body: 'Hi team, please review the attached design mockups for the new dashboard analytics page. We need your feedback by end of day tomorrow. Thanks!', date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(), read: true, important: false },
  ];

  const additionalTemplates = [
    { sender: 'Twitter', subject: 'Your weekly summary', body: 'See what you missed this week on Twitter. Your tweets got 1,200 impressions.' },
    { sender: 'Slack', subject: 'New messages in your workspace', body: 'You have unread messages in the #general and #design channels.' },
    { sender: 'Stripe', subject: 'Receipt for your recent payment', body: 'Thank you for your payment to Notion. Here is your receipt.' },
    { sender: 'Dropbox', subject: 'Your storage is almost full', body: 'Your Dropbox storage is 85% full. Upgrade now to get more space.' },
    { sender: 'Medium', subject: 'Recommended reading for you', body: 'Based on your interests in AI and product design, we think you might like these new articles.' },
    { sender: 'Figma', subject: 'Someone commented on your design', body: 'Jane Doe left a comment on your "Mobile App Login Flow" design. Click here to view it.' },
    { sender: 'Notion', subject: 'Your workspace summary', body: 'Here is what happened in your workspace this week. 10 new pages were created.' },
  ];

  const allEmails = [...baseEmails];
  for (let i = 6; i <= 25; i++) {
    const template = additionalTemplates[(i - 6) % additionalTemplates.length];
    const date = new Date(new Date().setDate(new Date().getDate() - (i - 1)));
    allEmails.push({
      id: i.toString(),
      sender: template.sender,
      senderEmail: `${template.sender.toLowerCase().replace(' ', '')}@example.com`,
      subject: `${template.subject} #${i-5}`,
      body: `${template.body} (Ref: ${Math.random().toString(36).substring(7)})`,
      date: date.toISOString(),
      read: i % 3 === 0,
      important: i % 7 === 0,
    });
  }
  return allEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const SAMPLE_EMAILS = generateSampleEmails();

// --- End of Data Generation ---

// --- Helper Components ---

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

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ backgroundColor: '#f9fafb' }}
      onClick={() => onSelect(email.id)}
      className={`p-4 border-b border-gray-200 cursor-pointer ${isSelected ? 'bg-indigo-100' : (email.read ? 'bg-white' : 'bg-blue-50')}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${email.read ? 'bg-transparent' : 'bg-blue-600'}`}></div>
          <p className="font-semibold text-sm truncate">{email.sender}</p>
        </div>
        <p className="text-xs text-gray-500 flex-shrink-0">{formatEmailDate(email.date)}</p>
      </div>
      <p className="mt-1 font-medium text-sm text-gray-800 truncate">{email.subject}</p>
      <p className="mt-1 text-sm text-gray-600 truncate">{email.body}</p>
    </motion.div>
  );
};

// --- Main Emails Page Component ---

const EmailsPage = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    setTimeout(() => {
      const allEmails = SAMPLE_EMAILS;
      setEmails(allEmails);
      setLoading(false);
      if (allEmails.length > 0) {
        setSelectedEmailId(allEmails[0].id);
      }
    }, 800);
  }, []);

  const handleSelectEmail = (emailId) => {
    setSelectedEmailId(emailId);
    setEmails(currentEmails =>
      currentEmails.map(email =>
        email.id === emailId ? { ...email, read: true } : email
      )
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to the first page when category changes
  };

  const filteredEmails = useMemo(() => {
    if (selectedCategory === 'important') return emails.filter(e => e.important);
    return emails;
  }, [emails, selectedCategory]);
  
  const selectedEmail = useMemo(() => emails.find(e => e.id === selectedEmailId), [emails, selectedEmailId]);
  const unreadCount = useMemo(() => emails.filter(e => !e.read).length, [emails]);

  // Pagination Logic
  const paginatedEmails = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmails.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmails, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="flex-shrink-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
         <h1 className="text-xl font-bold text-gray-800">MailFlare Inbox</h1>
         <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 hover:underline">← Back to Dashboard</button>
      </header>
      <main className="flex-grow flex min-h-0">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-4"><motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium shadow hover:bg-indigo-700">Compose</motion.button></div>
          <nav className="flex-grow p-2">
            <button onClick={() => handleCategoryChange('inbox')} className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center space-x-3 text-sm font-medium ${selectedCategory === 'inbox' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}><span>Inbox</span><span className="bg-indigo-600 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-auto">{unreadCount}</span></button>
            <button onClick={() => handleCategoryChange('important')} className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center space-x-3 text-sm font-medium ${selectedCategory === 'important' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}><span>Important</span></button>
          </nav>
        </div>
        
        {/* Email List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
            <div className="flex-grow overflow-y-auto">
                {paginatedEmails.map(email => <EmailItem key={email.id} email={email} onSelect={handleSelectEmail} isSelected={selectedEmailId === email.id} />)}
            </div>
            {/* Pagination Controls */}
            <div className="flex-shrink-0 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 border border-gray-300 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed">Prev</motion.button>
                <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 border border-gray-300 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed">Next</motion.button>
            </div>
        </div>
        
        {/* Email Content */}
        <div className="flex-grow bg-white p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedEmail ? (
              <motion.div key={selectedEmail.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedEmail.subject}</h2>
                <div className="flex items-center space-x-4 border-b border-gray-200 pb-4 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">{selectedEmail.sender[0]}</div>
                  <div><p className="font-semibold">{selectedEmail.sender}</p><p className="text-sm text-gray-500">to me &lt;{selectedEmail.senderEmail}&gt;</p></div>
                  <p className="text-sm text-gray-500 ml-auto">{new Date(selectedEmail.date).toLocaleString()}</p>
                </div>
                <div className="prose max-w-none text-gray-700"><p>{selectedEmail.body}</p></div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500"><p className="text-lg">Select an email to read</p><p>Nothing is selected.</p></div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default EmailsPage;

