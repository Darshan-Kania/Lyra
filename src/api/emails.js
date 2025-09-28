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
    read: email.read || false,
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
      // For important emails, we need to fetch all emails to properly paginate
      if (filter === "important") {
        const response = await apiClient.get(`/emails?page=1&limit=1000`); // Get all emails
        
        if (response.data.success) {
          const transformedEmails = transformEmailData(response.data.data);
          const importantEmails = transformedEmails.filter((e) => e.important);
          
          // Apply client-side pagination
          const startIndex = (page - 1) * limit;
          const paginatedEmails = importantEmails.slice(startIndex, startIndex + limit);
          
          return {
            success: true,
            emails: paginatedEmails,
            totalCount: importantEmails.length,
            totalPages: Math.ceil(importantEmails.length / limit),
            currentPage: page,
          };
        } else {
          throw new Error(response.data.message || "Failed to fetch emails");
        }
      } else {
        // For inbox, use server-side pagination
        const response = await apiClient.get(
          `/emails?page=${page}&limit=${limit}`
        );

        if (response.data.success) {
          const transformedEmails = transformEmailData(response.data.data);

          return {
            success: true,
            emails: transformedEmails,
            totalCount: response.data.total,
            totalPages: response.data.totalPages,
            currentPage: response.data.page,
          };
        } else {
          throw new Error(response.data.message || "Failed to fetch emails");
        }
      }
    } catch (error) {
      return {
        success: false,
        emails: null,
        totalCount: null,
        totalPages: null,
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

      if (response.data.success) {
        const email = response.data.data;
        return {
          success: true,
          email: {
            id: email._id,
            sender: email.from || "Unknown",
            senderEmail: email.from || "",
            subject: email.subject || "No subject",
            snippet: email.snippet || "",
            body: email.bodyHtml || "",
            plainbody: email.bodyPlain || "",
            date: email.createdAt || email.date,
            read: email.read || false,
            important: email.important || false,
            gmailMessageId: email.gmailMessageId,
            summary: email.summary || null,
            aiReplies: normalizeAiReplies(email),
          },
        };
      } else {
        throw new Error(response.data.message || "Email not found");
      }
    } catch (error) {
      return {
        success: false,
        email: null,
        error: error.message,
      };
    }
  },

  // Send a reply (uses backend endpoint if available)
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
};
