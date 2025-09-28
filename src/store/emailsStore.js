// Emails Store - Manages email data, filtering, and pagination
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { emailsAPI } from '../api';

const useEmailsStore = create(
  persist(
    (set, get) => ({
      // State
      emails: [],
      selectedEmailId: null,
      selectedCategory: 'inbox',
      currentPage: 1,
      itemsPerPage: 10,
      totalCount: 0,
      isLoading: false,
      error: null,
      lastFetched: null,

  // Actions
  fetchEmails: async (forceRefresh = false) => {
    const { lastFetched, selectedCategory, currentPage, itemsPerPage } = get();
    const now = Date.now();
    
    // Cache for 2 minutes unless force refresh
    if (!forceRefresh && lastFetched && now - lastFetched < 2 * 60 * 1000) {
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const result = await emailsAPI.getEmails(selectedCategory, currentPage, itemsPerPage);
      
      set({
        emails: result.emails,
        totalCount: result.totalCount,
        currentPage: result.currentPage || currentPage,
        isLoading: false,
        error: result.error || null,
        lastFetched: now
      });

  // Hydrate selected email with full details (summary, AI replies) if one is already selected (e.g., persisted)
  const { selectedEmailId: idToHydrate } = get();
  if (idToHydrate) {
        try {
          const detailRes = await emailsAPI.getEmailById(idToHydrate);
          if (detailRes && detailRes.email) {
            set(state => ({
              emails: state.emails.map(e =>
                e.id === idToHydrate ? { ...e, ...detailRes.email } : e
              )
            }));
          }
        } catch (e) {
          console.warn('Failed to hydrate selected email:', e.message);
        }
      }

    } catch (error) {
      set({
        isLoading: false,
        error: error.message
      });
    }
  },

  selectEmail: async (emailId) => {
    set({ selectedEmailId: emailId });
    
    // Mark as read when selected
    const { emails } = get();
    const email = emails.find(e => e.id === emailId);
    
    if (email && !email.read) {
      // Optimistically update UI
      set(state => ({
        emails: state.emails.map(e => 
          e.id === emailId ? { ...e, read: true } : e
        )
      }));

      // Try to update on server
      try {
        await emailsAPI.markAsRead(emailId);
      } catch (error) {
        console.error('Failed to mark email as read:', error);
        // Revert optimistic update on failure
        set(state => ({
          emails: state.emails.map(e => 
            e.id === emailId ? { ...e, read: false } : e
          )
        }));
      }
    }

    // Fetch full email details (summary, AI replies, etc.) when selected
    try {
      const res = await emailsAPI.getEmailById(emailId);
      if (res && res.email) {
        set(state => ({
          emails: state.emails.map(e => 
            e.id === emailId ? { ...e, ...res.email } : e
          )
        }));
      }
    } catch (error) {
      console.error('Failed to fetch email details:', error);
    }
  },

  setCategory: async (category) => {
    set({ 
      selectedCategory: category,
      currentPage: 1, // Reset to first page
      lastFetched: null // Force refresh for new category
    });
    await get().fetchEmails(true);
  },

  setPage: async (page) => {
    set({ currentPage: page });
    // Fetch emails for the new page
    await get().fetchEmails(true);
  },

  markAsImportant: async (emailId, important = true) => {
    // Optimistically update UI
    set(state => ({
      emails: state.emails.map(e => 
        e.id === emailId ? { ...e, important } : e
      )
    }));

    try {
      await emailsAPI.markAsImportant(emailId, important);
    } catch (error) {
      console.error('Failed to mark email as important:', error);
      // Revert optimistic update on failure
      set(state => ({
        emails: state.emails.map(e => 
          e.id === emailId ? { ...e, important: !important } : e
        )
      }));
    }
  },

  // Refresh emails data
  refresh: () => {
    return get().fetchEmails(true);
  },

  // Clear error state
  clearError: () => set({ error: null }),

  // Send a reply to an email (delegates to API; keeps UI free of HTTP calls)
  sendReply: async (emailId, message) => {
    try {
      const res = await emailsAPI.sendReply(emailId, message);
      return res;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reset emails state
  reset: () => set({
    emails: [],
    selectedEmailId: null,
    selectedCategory: 'inbox',
    currentPage: 1,
    totalCount: 0,
    isLoading: false,
    error: null,
    lastFetched: null
  })
}),
{
  name: 'emails-storage', // unique name  
  storage: createJSONStorage(() => localStorage),
  // Only persist user preferences, not the actual emails or loading states
  partialize: (state) => ({ 
  selectedCategory: state.selectedCategory,
  currentPage: state.currentPage,
  itemsPerPage: state.itemsPerPage,
  selectedEmailId: state.selectedEmailId
  }),
}
)
);

// Selectors - computed values that depend on state
export const useEmailSelectors = () => {
  const store = useEmailsStore();
  
  // For server-side pagination, we don't need to slice again
  // The emails array already contains the correct page of results
  const paginatedEmails = store.emails;

  const selectedEmail = store.emails.find(e => e.id === store.selectedEmailId) || null;
  const unreadCount = store.emails.filter(e => !e.read).length;
  const totalPages = Math.ceil(store.totalCount / store.itemsPerPage);

  return {
    ...store,
    paginatedEmails,
    selectedEmail,
    unreadCount,
    totalPages
  };
};

export default useEmailsStore;
