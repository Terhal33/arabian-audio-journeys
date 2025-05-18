
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
  const [isChecking, setIsChecking] = useState(true);
  
  // Try to access auth context safely
  let isAuthenticated = false;
  let isLoading = true;
  let user = null;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    isLoading = auth.isLoading;
    user = auth.user;
    
    // For debugging
    console.log("ProtectedRoute - Auth state:", { 
      isAuthenticated, 
      isLoading, 
      userId: user?.id,
      path: location.pathname
    });
  } catch (e) {
    console.error("ProtectedRoute: Error accessing auth context:", e);
    // If we can't access the auth context, we redirect to login
    if (!redirecting) {
      setRedirecting(true);
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
  }
  
  // Finish checking once auth loading is done
  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading]);
  
  // If still loading auth or checking, show a simple loading indicator
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-desert border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
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
