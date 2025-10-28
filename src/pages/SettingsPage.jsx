import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { settingsAPI } from '../api';

const SettingsPage = () => {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const [emailFilters, setEmailFilters] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Get user info from auth store
  const userName = authStore.user?.name || 'Guest';
  const userEmail = authStore.user?.email || 'No email available';

  // Fetch existing filters on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      setIsFetching(true);
      try {
        const response = await settingsAPI.getFilters();
        if (response.success && response.data?.emailFilters) {
          const filters = response.data.emailFilters;
          setEmailFilters(filters.length > 0 ? filters : ['']);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
      setIsFetching(false);
    };

    fetchFilters();
  }, []);

  const addEmailFilter = () => {
    setEmailFilters([...emailFilters, '']);
  };

  const removeEmailFilter = (index) => {
    setEmailFilters(emailFilters.filter((_, i) => i !== index));
  };

  const updateEmailFilter = (index, value) => {
    const updated = [...emailFilters];
    updated[index] = value;
    setEmailFilters(updated);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const validFilters = emailFilters.filter(email => email.trim() !== '');
      const response = await settingsAPI.updateFilters(validFilters);
      if (response.success) {
        alert('Settings saved successfully!');
        navigate('/dashboard');
      } else {
        alert('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
    setIsLoading(false);
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences and settings
            </p>
          </div>
          
          <div className="px-6 py-5 space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-900">Profile Information</h4>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={userName}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Name cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={userEmail}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
              </div>
            </div>
            
            <div className="pt-5">
              <h4 className="text-md font-medium text-gray-900">Filter Summarization</h4>
              <p className="mt-1 text-sm text-gray-500">
                Add email addresses to filter and summarize emails from specific senders
              </p>
              <div className="mt-4 space-y-4">
                {emailFilters.map((email, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmailFilter(index, e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter email address (e.g., sender@example.com)"
                      />
                    </div>
                    {emailFilters.length > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeEmailFilter(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    )}
                  </div>
                ))}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addEmailFilter}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Email Address
                </motion.button>
              </div>
            </div>
            

          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleCancel}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
