
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiresPremium?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresPremium = false
}) => {
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);
  
  // Try to access auth context safely
  let isAuthenticated = false;
  let isLoading = true;
  let user = null;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    isLoading = auth.isLoading;
    user = auth.user;
  } catch (e) {
    console.error("ProtectedRoute: Error accessing auth context:", e);
    // If we can't access the auth context, we redirect to login
    if (!redirecting) {
      setRedirecting(true);
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
  }
  
  // If still loading auth, show a simple loading indicator
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Check authentication
  if (!isAuthenticated && !redirecting) {
    // Save the current path for redirect after login
    console.log('Saving redirect path:', location.pathname);
    localStorage.setItem('redirectAfterLogin', location.pathname);
    
    // Prevent multiple redirects
    setRedirecting(true);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // Check premium status if required
  if (requiresPremium && user && !user.isPremium && !redirecting) {
    setRedirecting(true);
    return <Navigate to="/upgrade" replace />;
  }
  
  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;
