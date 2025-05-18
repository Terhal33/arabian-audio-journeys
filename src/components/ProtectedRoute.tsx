
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiresPremium?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresPremium = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  // Try to access auth context safely
  let isAuthenticated = false;
  let isLoading = true;
  let user = null;
  let isPremium = false;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    isLoading = auth.isLoading;
    user = auth.user;
    isPremium = auth.isPremium;
    
    // For debugging
    console.log("ProtectedRoute - Auth state:", { 
      isAuthenticated, 
      isLoading, 
      userId: user?.id,
      isPremium,
      path: location.pathname
    });
  } catch (e) {
    console.error("ProtectedRoute: Error accessing auth context:", e);
    // If we can't access the auth context, we redirect to login after a short delay
    if (!redirecting) {
      setRedirecting(true);
      // Use setTimeout to avoid the React warning about navigation during render
      setTimeout(() => {
        navigate('/login', { replace: true, state: { from: location } });
      }, 0);
    }
    return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
  }
  
  // Finish checking once auth loading is done
  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
      
      // Check authentication within useEffect to avoid navigation during render
      if (!isAuthenticated && !redirecting) {
        setRedirecting(true);
        // Save the current path for redirect after login
        console.log('Saving redirect path:', location.pathname);
        localStorage.setItem('redirectAfterLogin', location.pathname);
        navigate('/login', { replace: true, state: { from: location } });
      }
      
      // Check premium status if required
      if (requiresPremium && user && !isPremium && !redirecting) {
        setRedirecting(true);
        navigate('/subscription', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, location, navigate, redirecting, requiresPremium, isPremium]);
  
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
  
  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;
