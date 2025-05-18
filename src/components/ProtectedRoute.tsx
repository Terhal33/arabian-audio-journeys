
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
  // Use try/catch to handle cases where we might not be within an AuthProvider
  let authState;
  try {
    authState = useAuth();
  } catch (e) {
    console.error("ProtectedRoute: Error accessing auth context:", e);
    // If we can't access the auth context, we redirect to login
    return <Navigate to="/login" replace />;
  }
  
  const { isAuthenticated, isLoading, user, session } = authState;
  const location = useLocation();
  const hasSetRedirect = useRef(false);
  
  // Save the current location to redirect back after login - only once per path
  useEffect(() => {
    if (!isAuthenticated && requiresAuth && !isLoading && !hasSetRedirect.current) {
      console.log('Setting redirect for:', location.pathname);
      localStorage.setItem('redirectAfterLogin', location.pathname);
      hasSetRedirect.current = true;
    }
    
    return () => {
      // Only reset the ref when component unmounts, not on path changes
      if (location.pathname.includes('login') || location.pathname.includes('signup')) {
        hasSetRedirect.current = false;
      }
    };
  }, [isAuthenticated, requiresAuth, location.pathname, isLoading]);
  
  // Add debug logs
  console.log('ProtectedRoute state:', { 
    isAuthenticated, 
    isLoading, 
    requiresAuth,
    path: location.pathname,
    hasUser: !!user,
    hasSession: !!session
  });
  
  // Show loading state only if we're explicitly loading auth and this is a protected route
  if (isLoading && requiresAuth) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Check authentication
  if (requiresAuth && !isAuthenticated) {
    console.log('Redirecting to login from:', location.pathname);
    // Only redirect if there's definitely no session
    return <Navigate to="/login" replace />;
  }
  
  // Check premium status
  if (requiresPremium && !user?.isPremium) {
    return <Navigate to="/upgrade" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
