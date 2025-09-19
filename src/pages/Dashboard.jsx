import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useDashboardStore } from '../store';
import {
  DashboardHeader,
  DashboardStats,
  ActivityChart,
  QuickActions,
  TopContacts
} from '../components/dashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Zustand stores
  const { user, fetchUser } = useAuthStore();
  const {
    stats,
    topContacts,
    activityData,
    selectedTimeRange,
    isLoading,
    error,
    fetchStats,
    fetchActivityData,
    setTimeRange
  } = useDashboardStore();

  useEffect(() => {
    // Initialize dashboard data
    const initializeDashboard = async () => {
      await fetchUser();
      await fetchStats();
      await fetchActivityData();
    };

    initializeDashboard();
  }, [fetchUser, fetchStats, fetchActivityData]);

  const handleTimeRangeChange = (timeRange) => {
    setTimeRange(timeRange);
  };

  const handleNavigateToEmails = () => {
    navigate('/emails');
  };

  // Error handling
  if (error) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading dashboard
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader 
          user={user}
          onNavigateToEmails={handleNavigateToEmails}
        />
        
        <DashboardStats 
          stats={stats}
          isLoading={isLoading}
        />
        
        <ActivityChart 
          activityData={activityData}
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          isLoading={isLoading}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <QuickActions 
            onNavigate={navigate}
          />
          
          <TopContacts 
            contacts={topContacts}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
