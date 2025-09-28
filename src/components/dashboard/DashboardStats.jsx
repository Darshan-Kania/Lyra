// Dashboard Stats Cards Component
import React from 'react';

const StatsCard = ({ title, value, icon, subtitle, trend, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  const trendColor = trend?.startsWith('+') ? 'text-red-600' : trend?.startsWith('-') ? 'text-green-600' : 'text-gray-600';

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-center">
        <span className="text-sm text-gray-600">{subtitle}</span>
        {trend && (
          <span className={`ml-auto text-sm font-medium ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>
  </div>
  );
};

const DashboardStats = ({ stats, isLoading }) => {
  const statsConfig = [
    {
      title: "Today's Emails",
      value: isLoading ? '...' : stats.todaysEmails,
      subtitle: "Received today",
      color: 'green',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Total Emails",
      value: isLoading ? '...' : stats.totalEmails,
      subtitle: "All time",
      trend: "+12% ↑",
      color: 'indigo',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Unread",
      value: isLoading ? '...' : stats.unreadEmails,
      subtitle: "Messages waiting for you",
      trend: "+3 ↑",
      color: 'blue',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )
    },
    {
      title: "Important",
      value: isLoading ? '...' : stats.importantEmails,
      subtitle: "High priority messages",
      trend: "-2 ↓",
      color: 'amber',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
  <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
