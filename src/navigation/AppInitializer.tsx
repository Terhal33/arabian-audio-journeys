
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Splash from '@/pages/Splash';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    if (isLoading) return;
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      
      // Check if user has seen onboarding
      const hasSeenOnboarding = localStorage.getItem('aaj_onboarded');
      
      if (isAuthenticated) {
        // Redirect to the main app
        navigate('/home');
      } else if (hasSeenOnboarding === 'true') {
        // Returning user but not logged in
        navigate('/login');
      } else {
        // First-time user
        navigate('/onboarding');
      }
    }, 2000); // Show splash for 2 seconds
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, navigate]);
  
  if (showSplash || isLoading) {
    return <Splash />;
  }
  
  return <>{children}</>;
};

export default AppInitializer;
