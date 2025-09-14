import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AuthCallback from "../pages/AuthCallback";
import Dashboard from "../pages/Dashboard";
import EmailsPage from "../pages/EmailsPage";
import SettingsPage from "../pages/SettingsPage";
import AppLayout from "../components/common/AppLayout";
import { isAuthenticated } from "../utils/auth";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = React.useState(null);
  
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await isAuthenticated();
        setIsAuth(authStatus);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuth(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Show nothing while checking (prevents flash)
  if (isAuth === null) {
    return <div className="min-h-screen bg-gray-50" />;
  }
  
  return isAuth ? children : <Navigate to="/" replace />;
};

// Layout wrapper for protected routes
const ProtectedPageWithLayout = ({ element }) => (
  <ProtectedRoute>
    <AppLayout>
      {element}
    </AppLayout>
  </ProtectedRoute>
);

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route 
        path="/dashboard" 
        element={<ProtectedPageWithLayout element={<Dashboard />} />} 
      />
      <Route 
        path="/emails" 
        element={<ProtectedPageWithLayout element={<EmailsPage />} />} 
      />
      <Route 
        path="/settings" 
        element={<ProtectedPageWithLayout element={<SettingsPage />} />} 
      />
      {/* Add a catch-all route that redirects to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
