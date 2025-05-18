
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Splash from '@/pages/Splash';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    // Only run initialization logic once
    if (hasInitialized || isLoading) return;
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      setHasInitialized(true);
      
      // Skip navigation if already on the correct route
      const currentPath = location.pathname;
      const hasSeenOnboarding = localStorage.getItem('aaj_onboarded') === 'true';
      
      // Only navigate if we're on the root path or need to redirect
      if (currentPath === '/') {
        if (isAuthenticated) {
          navigate('/home', { replace: true });
        } else if (hasSeenOnboarding) {
          navigate('/login', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      }
    }, 2000); // Show splash for 2 seconds
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, navigate, location.pathname, hasInitialized]);
  
  if (showSplash || isLoading) {
    return <Splash />;
  }
  
  return <>{children}</>;
};

export default AppInitializer;
