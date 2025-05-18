
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';

interface PremiumRouteProps {
  children: JSX.Element;
}

const PremiumRoute: React.FC<PremiumRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isPremium, isLoading } = useAuth();
  
  // Debug log
  console.log('PremiumRoute check:', { isAuthenticated, isPremium, path: location.pathname });
  
  useEffect(() => {
    if (!isLoading && isAuthenticated && !isPremium) {
      toast({
        title: "Premium content",
        description: "This content requires a premium subscription",
      });
    }
  }, [isLoading, isAuthenticated, isPremium]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-desert border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated but not premium, redirect to subscription page
  if (!isPremium) {
    return <Navigate to="/subscription" replace />;
  }
  
  // User is premium, render the protected content
  return children;
};

export default PremiumRoute;
