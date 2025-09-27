import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthCallback from "../pages/AuthCallback";
import Dashboard from "../pages/Dashboard";
import EmailsPage from "../pages/EmailsPage";
import SettingsPage from "../pages/SettingsPage";
import EmailDetailPage from "../pages/EmailDetailPage";
import AppLayout from "../components/common/AppLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

const PageWithLayout = ({ element }) => (
  <AppLayout>
    {element}
  </AppLayout>
);

const ProtectedPageWithLayout = ({ element }) => (
  <ProtectedRoute>
    <PageWithLayout element={element} />
  </ProtectedRoute>
);

const AppRouter = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={<ProtectedPageWithLayout element={<Dashboard />} />} 
      />
      <Route 
        path="/emails" 
        element={<ProtectedPageWithLayout element={<EmailsPage />} />} 
      />
      <Route 
        path="/emails/:id" 
        element={<ProtectedPageWithLayout element={<EmailDetailPage />} />} 
      />
      <Route 
        path="/settings" 
        element={<ProtectedPageWithLayout element={<SettingsPage />} />} 
      />
      
      {/* Catch-all route - redirect to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
