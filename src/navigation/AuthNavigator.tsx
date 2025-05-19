
import React, { memo, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Verification from '@/pages/Verification';
import Onboarding from '@/pages/Onboarding';

interface AuthNavigatorProps {
  showOnboarding: boolean;
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ showOnboarding }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  console.log("AuthNavigator rendering, path:", location.pathname, "isAuthenticated:", isAuthenticated);
  
  useEffect(() => {
    console.log("AuthNavigator mounted with path:", location.pathname);
  }, [location.pathname]);
  
  // Only redirect authenticated users for login and signup pages
  // Allow access to forgot-password, register, verification, and onboarding regardless of auth state
  const publicPaths = ['/register', '/verification', '/onboarding', '/forgot-password'];
  const isPublicPath = publicPaths.some(path => location.pathname.includes(path));
  
  if (isAuthenticated && !isPublicPath && location.pathname !== '/') {
    console.log("User is authenticated in AuthNavigator, redirecting to home");
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
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="*" element={<Navigate to={showOnboarding ? "/" : "/login"} replace />} />
    </Routes>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(AuthNavigator);
