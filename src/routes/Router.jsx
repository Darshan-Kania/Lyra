import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthCallback from "../pages/AuthCallback";
import Dashboard from "../pages/Dashboard";
import EmailsPage from "../pages/EmailsPage";
import SettingsPage from "../pages/SettingsPage";
import EmailDetailPage from "../pages/EmailDetailPage";
import AppLayout from "../components/common/AppLayout";
const PageWithLayout = ({ element }) => (
  <AppLayout>
    {element}
  </AppLayout>
);

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route 
        path="/dashboard" 
        element={<PageWithLayout element={<Dashboard />} />} 
      />
      <Route 
        path="/emails" 
        element={<PageWithLayout element={<EmailsPage />} />} 
      />
      <Route 
        path="/emails/:id" 
        element={<PageWithLayout element={<EmailDetailPage />} />} 
      />
      <Route 
        path="/settings" 
        element={<PageWithLayout element={<SettingsPage />} />} 
      />
      {/* Add a catch-all route that redirects to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
