
import React, { memo } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Verification from '@/pages/Verification';
import Onboarding from '@/pages/Onboarding';

interface AuthNavigatorProps {
  showOnboarding: boolean;
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ showOnboarding }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // If user is authenticated and trying to access auth routes, redirect to main app
  if (isAuthenticated && !location.pathname.startsWith('/onboarding')) {
    // Check if there's a requested redirect
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin'); // Clear it after use
      return <Navigate to={redirectPath} replace />;
    }
    
    // Default redirect if no specific path was saved
    return <Navigate to="/home" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={showOnboarding ? <Onboarding /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="*" element={<Navigate to={showOnboarding ? "/" : "/login"} replace />} />
    </Routes>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(AuthNavigator);
