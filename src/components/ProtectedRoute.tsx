
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

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
  const { toast } = useToast();
  const [redirecting, setRedirecting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
    setError("Authentication error. Please try again.");
    
    // If we can't access the auth context, we redirect to login after a short delay
    if (!redirecting) {
      setRedirecting(true);
      // Use setTimeout to avoid the React warning about navigation during render
      setTimeout(() => {
        navigate('/login', { replace: true, state: { from: location } });
      }, 0);
    }
    return (
      <div className="flex items-center justify-center h-screen bg-sand-light">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md"
        >
          <LoadingSpinner text="Redirecting to login..." />
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </motion.div>
      </div>
    );
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
        
        toast({
          title: "Authentication required",
          description: "Please login to access this page",
          variant: "destructive",
        });
        
        navigate('/login', { replace: true, state: { from: location } });
      }
      
      // Check premium status if required
      if (requiresPremium && user && !isPremium && !redirecting) {
        setRedirecting(true);
        toast({
          title: "Premium access required",
          description: "This content is only available to premium subscribers",
          variant: "destructive",
        });
        navigate('/subscription', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, location, navigate, redirecting, requiresPremium, isPremium, toast]);
  
  // If still loading auth or checking, show a loading spinner
  if (isLoading || isChecking) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen bg-sand-light"
      >
        <div className="text-center">
          <LoadingSpinner size="large" text="Authenticating..." />
        </div>
      </motion.div>
    );
  }
  
  // All checks passed, render the protected content with a smooth transition
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute;
