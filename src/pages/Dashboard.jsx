import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useDashboardStore } from "../store";
import {
  DashboardHeader,
  DashboardStats,
  ActivityChart,
  QuickActions,
} from "../components/dashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  // Zustand stores
  const { user, fetchUser, logout } = useAuthStore();
  const {
    stats,
    activityData,
    selectedTimeRange,
    isLoading,
    error,
    fetchStats,
    fetchActivityData,
    setTimeRange,
  } = useDashboardStore();

  useEffect(() => {
    let isMounted = true;

    // Initialize dashboard data only once when component mounts
    const initializeDashboard = async () => {
      if (!hasInitialized.current && isMounted) {
        hasInitialized.current = true;
        if (!user && isMounted) {
          await fetchUser();
        }
        if (isMounted) {
          await fetchStats();
          await fetchActivityData();
        }
      }
    };

    initializeDashboard();

    // Cleanup function to prevent API calls if component unmounts
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimeRangeChange = (timeRange) => setTimeRange(timeRange);

  const handleNavigateToEmails = () => {
    navigate("/emails");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
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

        <DashboardStats stats={stats} isLoading={isLoading} />

        <ActivityChart
          activityData={activityData}
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={handleTimeRangeChange}
          isLoading={isLoading}
        />

        <QuickActions onNavigate={navigate} onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default Dashboard;
