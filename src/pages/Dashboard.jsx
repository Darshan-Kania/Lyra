import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for charts
const sampleActivityData = [
  { day: 'Mon', emails: 12 },
  { day: 'Tue', emails: 19 },
  { day: 'Wed', emails: 15 },
  { day: 'Thu', emails: 25 },
  { day: 'Fri', emails: 30 },
  { day: 'Sat', emails: 8 },
  { day: 'Sun', emails: 5 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalEmails: 0,
    unreadEmails: 0,
    importantEmails: 0,
    todaysEmails: 0
  });
  const [chartData, setChartData] = useState(sampleActivityData);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [topContacts, setTopContacts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      // Fetch user info
      await axios.get(`${BACKEND_URL}/dashboard/userProfile`, { withCredentials: true })
        .then(res => {
          // Accept both {success: true, data: {...}} and direct user object
          const userData = res.data && res.data.data ? res.data.data : res.data;
          setUser(userData);
        })
        .catch(() => setUser(null));
      // Fetch total email count
      await axios.get(`${BACKEND_URL}/dashboard/EmailCount`, { withCredentials: true })
        .then(res => setStats(prev => ({ ...prev, totalEmails: res.data.count ?? 0 })))
        .catch(() => {});

      // Fetch unread email count
      await axios.get(`${BACKEND_URL}/dashboard/EmailCount?label=unread`, { withCredentials: true })
        .then(res => setStats(prev => ({ ...prev, unreadEmails: res.data.count ?? 0 })))
        .catch(() => {});

      // Fetch today's email count
      await axios.get(`${BACKEND_URL}/dashboard/EmailCount?label=today`, { withCredentials: true })
        .then(res => setStats(prev => ({ ...prev, todaysEmails: res.data.count ?? 0 })))
        .catch(() => {});

      // Fetch top contacts
      await axios.get(`${BACKEND_URL}/user/topContacts`, { withCredentials: true })
        .then(res => setTopContacts(res.data.contacts || []))
        .catch(() => setTopContacts([]));

      // Optionally: fetch chart/activity data from backend if available
      // await axios.get(`${BACKEND_URL}/dashboard/activity`, { withCredentials: true })
      //   .then(res => setChartData(res.data.activity || sampleActivityData))
      //   .catch(() => {});
    };
    fetchDashboardData();
  }, []);
  useEffect(() => {
  }, [user]);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back
              {user && (user.name
                ? `, ${user.name}`
                : user.email
                  ? `, ${user.email.split('@')[0]}`
                  : '')}!
            </h1>
            <p className="mt-1 text-sm text-gray-600">Here's an overview of your email activity</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/emails')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              View All Emails
            </motion.button>
          </div>
        </div>
        
        {/* Stats cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Today's emails */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white shadow-sm rounded-xl p-6 border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Today's Emails</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.todaysEmails}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-gray-600">Received today</span>
            </div>
          </motion.div>
          {/* Total emails */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white shadow-sm rounded-xl p-6 border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Emails</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalEmails}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-gray-600">All time</span>
              <span className="ml-auto text-sm text-indigo-600 font-medium">+12% ↑</span>
            </div>
          </motion.div>
          
          {/* Unread emails */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white shadow-sm rounded-xl p-6 border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Unread</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.unreadEmails}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-gray-600">Messages waiting for you</span>
              <span className="ml-auto text-sm text-red-600 font-medium">+3 ↑</span>
            </div>
          </motion.div>
          
          {/* Important emails */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white shadow-sm rounded-xl p-6 border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Important</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.importantEmails}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-gray-600">High priority messages</span>
              <span className="ml-auto text-sm text-green-600 font-medium">-2 ↓</span>
            </div>
          </motion.div>
        </div>
        
        {/* Email Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Email Activity</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setSelectedTimeRange('week')}
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedTimeRange === 'week' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Week
              </button>
              <button 
                onClick={() => setSelectedTimeRange('month')}
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedTimeRange === 'month' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Month
              </button>
              <button 
                onClick={() => setSelectedTimeRange('year')}
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedTimeRange === 'year' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Year
              </button>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="emails"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Quick actions and shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gray-50 p-4 rounded-lg text-center cursor-pointer"
                onClick={() => navigate('/emails')}
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Check Mail</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gray-50 p-4 rounded-lg text-center cursor-pointer"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Compose</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gray-50 p-4 rounded-lg text-center cursor-pointer"
                onClick={() => navigate('/settings')}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Settings</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gray-50 p-4 rounded-lg text-center cursor-pointer"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Logout</p>
              </motion.div>
            </div>
          </div>
        
        {/* Top contacts */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Top Contacts</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">View all</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {topContacts.map((contact, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-indigo-700 font-semibold">{contact.name ? contact.name[0] : '?'}</span>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-gray-500 mb-1">{contact.email}</p>
                    <p className="text-xs text-gray-500">{contact.count} emails</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
