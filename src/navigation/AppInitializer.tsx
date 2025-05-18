
import React, { useEffect, useState, useRef } from 'react';
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
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    // Only run initialization logic once and only after auth is loaded
    if (hasInitialized.current || isLoading) return;
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      hasInitialized.current = true;
      
      // Only navigate if we're on the root path
      if (location.pathname === '/') {
        if (isAuthenticated) {
          navigate('/home', { replace: true });
        } else {
          const hasSeenOnboarding = localStorage.getItem('aaj_onboarded') === 'true';
          if (hasSeenOnboarding) {
            navigate('/login', { replace: true });
          } else {
            navigate('/onboarding', { replace: true });
          }
        }
      }
    }, 2000); // Show splash for 2 seconds
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, navigate, location.pathname]);
  
  if (showSplash || isLoading) {
    return <Splash />;
  }
  
  return <>{children}</>;
};

export default AppInitializer;
