
import React, { useEffect, useRef } from 'react';
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
  const { isAuthenticated, isLoading, isPremium } = useAuth();
  const location = useLocation();
  const hasSetRedirect = useRef(false);
  
  // Save the current location to redirect back after login - only once per path
  useEffect(() => {
    if (!isAuthenticated && requiresAuth && !isLoading && !hasSetRedirect.current) {
      localStorage.setItem('redirectAfterLogin', location.pathname);
      hasSetRedirect.current = true;
    }
    
    return () => {
      // Reset the ref when component unmounts or path changes
      hasSetRedirect.current = false;
    };
  }, [isAuthenticated, requiresAuth, location.pathname, isLoading]);
  
  // Show loading state only if we're explicitly loading auth
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
