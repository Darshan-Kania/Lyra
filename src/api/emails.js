// Emails API methods
import apiClient from './client.js';

// Helper function to normalize AI replies from various backend fields
const normalizeAiReplies = (email) => {
  const replies =
    email.aiReplies ||
    email.suggestedReplies ||
    email.smartReplies ||
    email.ai_replies ||
    email.replies ||
    [];
  if (!Array.isArray(replies)) return [];
  // Trim to first 3 concise suggestions
  return replies.filter(Boolean).slice(0, 3);
};

// Helper function to transform backend email data to frontend format
const transformEmailData = (backendEmails) => {
  return backendEmails.map(email => ({
    id: email._id,
    sender: email.from || 'Unknown',
    senderEmail: email.from || '',
    subject: email.subject || 'No subject',
    body: email.body || email.snippet || '',
    date: email.createdAt || email.date,
    read: email.read || false,
    important: email.important || false,
    gmailMessageId: email.gmailMessageId,
    summary: email.summary || null,
    aiReplies: normalizeAiReplies(email)
  }));
};

// Sample email data generator (for development/fallback)
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
    const subject = `${template.subject} #${i-5}`;
    const body = `${template.body} (Ref: ${Math.random().toString(36).substring(7)})`;
    allEmails.push({
      id: i.toString(),
      sender: template.sender,
      senderEmail: `${template.sender.toLowerCase().replace(' ', '')}@example.com`,
      subject,
      body,
      date: date.toISOString(),
      read: i % 3 === 0,
      important: i % 7 === 0,
      summary: `Summary: ${body.slice(0, 80)}...`,
      aiReplies: [
        `Thanks for the update! Could you share more details on ${template.sender === 'Design Team' ? 'the mockups' : 'this'}?`,
        'Looks good to me. Approved.',
        'Let’s schedule a quick call to discuss next steps.'
      ]
    });
  }
  return allEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const emailsAPI = {
  // Get all emails with pagination
  getEmails: async (filter = 'inbox', page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/emails?page=${page}&limit=${limit}`);

      if (response.data.success) {
        const transformedEmails = transformEmailData(response.data.data);
        
        // Apply client-side filtering for important emails if needed
        const filteredEmails = filter === 'important' 
          ? transformedEmails.filter(e => e.important)
          : transformedEmails;

        return {
          success: true,
          emails: filteredEmails,
          totalCount: response.data.total,
          totalPages: response.data.totalPages,
          currentPage: response.data.page
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch emails');
      }
    } catch (error) {
      console.warn('Email API failed, using fallback data:', error.message);
      // Return sample data as fallback
      const sampleEmails = generateSampleEmails();
      const filteredEmails = filter === 'important' 
        ? sampleEmails.filter(e => e.important)
        : sampleEmails;
      
      return {
        success: false,
        emails: filteredEmails,
        totalCount: filteredEmails.length,
        totalPages: Math.ceil(filteredEmails.length / limit),
        currentPage: page,
        error: error.message
      };
    }
  },

  // Mark email as read
  markAsRead: async (emailId) => {
    try {
      const response = await apiClient.patch(`/emails/${emailId}/read`);
      return { 
        success: response.data.success !== false 
      };
    } catch (error) {
      console.warn(`Mark as read failed for email ${emailId}:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Mark email as important
  markAsImportant: async (emailId, important = true) => {
    try {
      const response = await apiClient.patch(`/emails/${emailId}/important`, { important });
      return { 
        success: response.data.success !== false 
      };
    } catch (error) {
      console.warn(`Mark as important failed for email ${emailId}:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get single email by ID
  getEmailById: async (emailId) => {
    try {
      const response = await apiClient.get(`/emails/${emailId}`);
      
      if (response.data.success) {
        const email = response.data.data;
    return {
          success: true,
          email: {
            id: email._id,
            sender: email.from || 'Unknown',
            senderEmail: email.from || '',
            subject: email.subject || 'No subject',
            body: email.body || email.snippet || '',
            date: email.createdAt || email.date,
            read: email.read || false,
            important: email.important || false,
            gmailMessageId: email.gmailMessageId,
      summary: email.summary || null,
      aiReplies: normalizeAiReplies(email)
          }
        };
      } else {
        throw new Error(response.data.message || 'Email not found');
      }
    } catch (error) {
      console.warn(`Email ${emailId} API failed, using fallback data:`, error.message);
      // Return sample email as fallback
      const sampleEmails = generateSampleEmails();
      const email = sampleEmails.find(e => e.id === emailId);
      
      return {
        success: false,
        email: email || null,
        error: error.message
      };
    }
  },

  // Send a reply (uses backend endpoint if available)
  sendReply: async (emailId, message) => {
    try {
      const response = await apiClient.post(`/emails/${emailId}/reply`, { body: message });
      return {
        success: response.data?.success !== false,
        data: response.data
      };
    } catch (error) {
      console.warn(`Send reply failed for email ${emailId}:`, error.message);
      return { success: false, error: error.message };
    }
  }
};
