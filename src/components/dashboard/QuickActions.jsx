// Quick Actions Component
import React from 'react';
import { motion } from 'framer-motion';

const QuickActionCard = ({ icon, label, onClick, bgColor = 'bg-gray-50', iconColor = 'text-indigo-600' }) => (
  <motion.div 
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className={`${bgColor} p-4 rounded-lg text-center cursor-pointer transition-colors hover:bg-opacity-80`}
    onClick={onClick}
  >
    <div className={`w-10 h-10 ${iconColor.replace('text-', 'bg-').replace('600', '100')} rounded-full flex items-center justify-center mx-auto mb-2`}>
      <div className={`${iconColor}`}>
        {icon}
      </div>
    </div>
    <p className="text-sm font-medium">{label}</p>
  </motion.div>
);

const QuickActions = ({ onNavigate, onLogout }) => {
  const actions = [
    {
      label: 'Check Mail',
      onClick: () => onNavigate('/emails'),
      iconColor: 'text-indigo-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: 'Settings',
      onClick: () => onNavigate('/settings'),
      iconColor: 'text-purple-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      label: 'Logout',
      onClick: () => { if (typeof onLogout === 'function') onLogout(); },
      iconColor: 'text-red-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <QuickActionCard 
            key={index}
            {...action}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
