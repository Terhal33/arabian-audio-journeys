
import React from 'react';
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
  if (isAuthenticated && 
      !['/onboarding'].some(route => location.pathname.startsWith(route))) {
    // Check if there's a requested redirect
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    localStorage.removeItem('redirectAfterLogin'); // Clear it after use
    return <Navigate to={redirectPath || '/home'} replace />;
  }

  // Default route to show when navigating to auth
  const initialRoute = showOnboarding ? '/onboarding' : '/login';

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="*" element={<Navigate to={initialRoute} replace />} />
    </Routes>
  );
};

export default AuthNavigator;
