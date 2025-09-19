// Custom hooks for common store operations
import { useCallback } from 'react';
import { useAuthStore, useDashboardStore, useEmailsStore } from '../store';

// Auth hooks
export const useAuth = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    error,
    checkAuthStatus,
    fetchUser,
    initiateGoogleLogin,
    logout,
    clearError,
    resetAuth
  } = useAuthStore();

  const login = useCallback(() => {
    initiateGoogleLogin();
  }, [initiateGoogleLogin]);

  const getUserDisplayName = useCallback(() => {
    if (!user) return '';
    return user.name || user.email?.split('@')[0] || 'User';
  }, [user]);

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    checkAuthStatus,
    fetchUser,
    login,
    logout,
    clearError,
    resetAuth,
    getUserDisplayName
  };
};

// Dashboard hooks
export const useDashboard = () => {
  const {
    stats,
    topContacts,
    activityData,
    selectedTimeRange,
    isLoading,
    error,
    fetchStats,
    fetchActivityData,
    setTimeRange,
    updateStat,
    clearError,
    reset
  } = useDashboardStore();

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchStats(),
      fetchActivityData()
    ]);
  }, [fetchStats, fetchActivityData]);

  return {
    stats,
    topContacts,
    activityData,
    selectedTimeRange,
    isLoading,
    error,
    fetchStats,
    fetchActivityData,
    setTimeRange,
    updateStat,
    clearError,
    reset,
    refreshAll
  };
};

// Emails hooks  
export const useEmails = () => {
  const {
    emails,
    selectedEmailId,
    selectedCategory,
    currentPage,
    itemsPerPage,
    totalCount,
    isLoading,
    error,
    filteredEmails,
    paginatedEmails,
    selectedEmail,
    unreadCount,
    totalPages,
    fetchEmails,
    selectEmail,
    setCategory,
    setPage,
    markAsImportant,
    refresh,
    clearError,
    reset
  } = useEmailsStore();

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  }, [currentPage, totalPages, setPage]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  }, [currentPage, setPage]);

  const toggleImportant = useCallback((emailId) => {
    const email = emails.find(e => e.id === emailId);
    if (email) {
      markAsImportant(emailId, !email.important);
    }
  }, [emails, markAsImportant]);

  return {
    emails,
    selectedEmailId,
    selectedCategory,
    currentPage,
    itemsPerPage,
    totalCount,
    isLoading,
    error,
    filteredEmails,
    paginatedEmails,
    selectedEmail,
    unreadCount,
    totalPages,
    fetchEmails,
    selectEmail,
    setCategory,
    setPage,
    goToNextPage,
    goToPrevPage,
    markAsImportant,
    toggleImportant,
    refresh,
    clearError,
    reset
  };
};
