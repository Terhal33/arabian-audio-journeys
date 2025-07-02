
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';

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
  
  const { isAuthenticated, isLoading, user, isPremium } = useAuth();
  
  console.log("ProtectedRoute - Auth state:", { 
    isAuthenticated, 
    isLoading, 
    userId: user?.id,
    isPremium,
    path: location.pathname
  });

  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
      
      if (!isAuthenticated && !redirecting) {
        setRedirecting(true);
        console.log('Saving redirect path:', location.pathname);
        localStorage.setItem('redirectAfterLogin', location.pathname);
        
        toast({
          title: "Authentication required",
          description: "Please login to access this page",
          variant: "destructive",
        });
        
        navigate('/login', { replace: true, state: { from: location } });
      }
      
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
  
  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </ErrorBoundary>
  );
};

export default ProtectedRoute;
