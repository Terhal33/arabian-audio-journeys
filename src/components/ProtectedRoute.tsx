
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiresAuth?: boolean;
  requiresPremium?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAuth = true,
  requiresPremium = false
}) => {
  const { isAuthenticated, isLoading, user, isPremium } = useAuth();
  const location = useLocation();
  
  // Save the current location to redirect back after login
  useEffect(() => {
    if (!isAuthenticated && requiresAuth) {
      localStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isAuthenticated, requiresAuth, location]);
  
  // Show loading state
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Check authentication
  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check premium status
  if (requiresPremium && !isPremium) {
    return <Navigate to="/upgrade" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
