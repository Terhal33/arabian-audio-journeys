
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
      
      // Skip navigation if already on an auth route or the current route is valid
      const currentPath = location.pathname;
      const isAuthRoute = ['/login', '/signup', '/forgot-password', '/verification', '/onboarding'].some(
        route => currentPath.startsWith(route)
      );
      const hasSeenOnboarding = localStorage.getItem('aaj_onboarded') === 'true';
      
      // Only navigate if we're on the root path
      if (currentPath === '/') {
        if (isAuthenticated) {
          navigate('/home', { replace: true });
        } else if (hasSeenOnboarding) {
          navigate('/login', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      }
      // Don't redirect if already on a valid path
      else if (!isAuthRoute && !isAuthenticated) {
        navigate('/login', { replace: true });
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
