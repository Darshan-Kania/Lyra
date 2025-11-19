// Emails API methods
import apiClient from "./client.js";

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
  return backendEmails.map((email) => ({
    id: email._id,
    sender: email.from || "Unknown",
    senderEmail: email.from || "",
    subject: email.subject || "No subject",
    body: email.body || email.snippet || "",
    plainbody: email.plainbody || email.plaintext || email.textContent || "",
    date: email.createdAt || email.date,
    read: email.isRead || email.read || false,
    important: email.important || false,
    gmailMessageId: email.gmailMessageId,
    summary: email.summary || null,
    aiReplies: normalizeAiReplies(email),
  }));
};


export const emailsAPI = {
  // Get all emails with pagination
  getEmails: async (filter = "inbox", page = 1, limit = 10) => {
    try {
      // Helper to normalize various backend response shapes
      const normalizeList = (raw, fallbackPage = page, fallbackLimit = limit) => {
        const rd = raw ?? {};
        let items = [];
        if (Array.isArray(rd)) items = rd;
        else if (Array.isArray(rd.data)) items = rd.data;
        else if (Array.isArray(rd.emails)) items = rd.emails;
        else if (rd.data && Array.isArray(rd.data.emails)) items = rd.data.emails;
        else if (rd.data && Array.isArray(rd.data.data)) items = rd.data.data; // nested data
        else if (rd.data && Array.isArray(rd.data.list)) items = rd.data.list;

        const total = rd.total ?? rd.totalCount ?? (Array.isArray(items) ? items.length : 0);
        const currentPage = rd.page ?? rd.currentPage ?? fallbackPage;
        const totalPages = rd.totalPages ?? (fallbackLimit ? Math.max(1, Math.ceil(total / fallbackLimit)) : 1);
        const message = rd.message ?? rd.error ?? null;
        const explicitFailure = rd.success === false; // treat only explicit false as failure
        return { items, total, currentPage, totalPages, message, explicitFailure };
      };

      // Transform sent emails to match inbox email structure
      const transformSentEmail = (sentEmail) => ({
        id: sentEmail._id,
        sender: sentEmail.to || "Unknown", // For sent emails, "to" is like the sender
        senderEmail: sentEmail.to || "",
        subject: sentEmail.subject || "No subject",
        body: sentEmail.body || "",
        plainbody: sentEmail.body || "",
        date: sentEmail.sentAt || sentEmail.createdAt,
        read: true, // Sent emails are always "read"
        important: false,
        gmailMessageId: sentEmail.gmailMessageId,
        isSent: true, // Flag to identify sent emails
        threadId: sentEmail.threadId,
        originalEmailId: sentEmail.originalEmail?._id,
      });

      if (filter === "sent") {
        // Fetch sent emails from separate endpoint
        const response = await apiClient.get(`/emails/sent?page=${page}&limit=${limit}`);
        const { items, total, totalPages, currentPage, message, explicitFailure } = normalizeList(response.data, page, limit);
        if (explicitFailure && (!items || items.length === 0)) {
          return { success: false, emails: [], totalCount: 0, totalPages: 1, currentPage: page, error: message || "Failed to fetch sent emails" };
        }
        const transformedEmails = items.map(transformSentEmail);
        return {
          success: true,
          emails: transformedEmails,
          totalCount: total,
          totalPages: totalPages,
          currentPage: currentPage,
        };
      }

      if (filter === "important") {
        // Fetch many to allow client-side filtering of important items
        const response = await apiClient.get(`/emails?page=1&limit=1000`);
        const { items, message, explicitFailure } = normalizeList(response.data, 1, 1000);
        if (explicitFailure && (!items || items.length === 0)) {
          return { success: false, emails: [], totalCount: 0, totalPages: 1, currentPage: page, error: message || "Failed to fetch emails" };
        }
        const transformedEmails = transformEmailData(items || []);
        const importantEmails = transformedEmails.filter((e) => e.important);
        const startIndex = (page - 1) * limit;
        const paginatedEmails = importantEmails.slice(startIndex, startIndex + limit);
        return {
          success: true,
          emails: paginatedEmails,
          totalCount: importantEmails.length,
          totalPages: Math.max(1, Math.ceil(importantEmails.length / limit)),
          currentPage: page,
        };
      }

      // Inbox or other categories: rely on server pagination, but be flexible
      const response = await apiClient.get(`/emails?page=${page}&limit=${limit}`);
      const { items, total, totalPages, currentPage, message, explicitFailure } = normalizeList(response.data, page, limit);
      if (explicitFailure && (!items || items.length === 0)) {
        return { success: false, emails: [], totalCount: 0, totalPages: 1, currentPage: page, error: message || "Failed to fetch emails" };
      }
      const transformedEmails = transformEmailData(items || []);
      return {
        success: true,
        emails: transformedEmails,
        totalCount: total,
        totalPages: totalPages,
        currentPage: currentPage,
      };
    } catch (error) {
      return {
        success: false,
        emails: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: page,
        error: error.message,
      };
    }
  },

  // Mark email as read
  markAsRead: async (emailId) => {
    try {
      const response = await apiClient.patch(`/emails/${emailId}/read`);
      return {
        success: response.data.success !== false,
      };
    } catch (error) {
      console.warn(`Mark as read failed for email ${emailId}:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Mark email as important
  markAsImportant: async (emailId, important = true) => {
    try {
      const response = await apiClient.patch(`/emails/${emailId}/important`, {
        important,
      });
      return {
        success: response.data.success !== false,
      };
    } catch (error) {
      console.warn(
        `Mark as important failed for email ${emailId}:`,
        error.message
      );
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get single email by ID
  getEmailById: async (emailId) => {
    try {
      const response = await apiClient.get(`/emails/${emailId}`);
      const rd = response.data ?? {};
      // Accept multiple shapes
      const email = rd.data || rd.email || rd.item || rd;
      const explicitFailure = rd.success === false;
      if (!email || explicitFailure) {
        return { success: false, email: null, error: rd.message || "Email not found" };
      }
      const mapped = {
        id: email._id || email.id || email.gmailMessageId,
        sender: email.from || email.sender || "Unknown",
        senderEmail: email.from || email.senderEmail || "",
        subject: email.subject || "No subject",
        snippet: email.snippet || "",
        body: email.bodyHtml || email.body || "",
        plainbody: email.bodyPlain || email.plainbody || email.plaintext || "",
        date: email.createdAt || email.date,
        read: email.isRead || email.read || false,
        important: email.important || false,
        gmailMessageId: email.gmailMessageId,
        summary: email.summary || null,
        aiReplies: normalizeAiReplies(email),
      };
      return { success: true, email: mapped };
    } catch (error) {
      return { success: false, email: null, error: error.message };
    }
  },

  // Send a reply to an email (uses backend endpoint if available)
  sendReply: async (emailId, message) => {
    try {
      const response = await apiClient.post(`/emails/${emailId}/reply`, {
        body: message,
      });
      return {
        success: response.data?.success !== false,
        data: response.data,
      };
    } catch (error) {
      console.warn(`Send reply failed for email ${emailId}:`, error.message);
      return { success: false, error: error.message };
    }
  },

  // Compose and send a new email
  composeEmail: async ({ to, cc, bcc, subject, body }) => {
    try {
      const response = await apiClient.post('/emails/compose', {
        to,
        cc,
        bcc,
        subject,
        body,
      });
      return {
        success: response.data?.success !== false,
        data: response.data,
      };
    } catch (error) {
      console.warn('Compose email failed:', error.message);
      return { success: false, error: error.message };
    }
  },
};
