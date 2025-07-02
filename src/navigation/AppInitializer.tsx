
import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import Splash from '@/pages/Splash';
import AuthNavigator from '@/navigation/AuthNavigator';
import MainNavigator from '@/navigation/MainNavigator';
import NotFound from '@/pages/NotFound';
import LanguageSelection from '@/pages/LanguageSelection';
import Onboarding from '@/pages/Onboarding';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundary from '@/components/ErrorBoundary';

const AppInitializer: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const hasInitialized = useRef(false);
  const isNavigating = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  console.log('AppInitializer - Auth state:', { 
    isLoading, 
    isAuthenticated, 
    currentPath: location.pathname,
    hasInitialized: hasInitialized.current
  });
  
  useEffect(() => {
    if (isLoading || hasInitialized.current || isNavigating.current) return;
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      hasInitialized.current = true;
      
      const publicPaths = ['/register', '/verification', '/forgot-password', '/signup', '/login', '/language-selection', '/onboarding'];
      const isPublicPath = publicPaths.some(path => location.pathname === path || location.pathname.startsWith(path));
      const isRootPath = location.pathname === '/';
      
      if (!isPublicPath && !isRootPath) {
        isNavigating.current = true;
        const hasSeenOnboarding = localStorage.getItem('aaj_onboarded') === 'true';
        const hasSelectedLanguage = localStorage.getItem('aaj_language');
        
        if (!isAuthenticated) {
          if (!hasSelectedLanguage) {
            navigate('/language-selection', { replace: true });
          } else if (!hasSeenOnboarding) {
            navigate('/onboarding', { replace: true });
            toast({
              title: "Welcome to Arabian Audio",
              description: "Let's get you started with a quick tour",
            });
          } else {
            navigate('/login', { replace: true });
          }
        } else if (location.pathname !== '/profile') {
          console.log("User is authenticated, redirecting to home page");
          navigate('/home', { replace: true });
          toast({
            title: "Welcome back",
            description: "Continue your journey through Saudi Arabia's history",
            variant: "default",
          });
        }
        
        setTimeout(() => {
          isNavigating.current = false;
        }, 100);
      }
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, navigate, location.pathname, toast]);
  
  if (showSplash || isLoading) {
    return <Splash />;
  }
  
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/language-selection" element={<LanguageSelection />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login/*" element={<AuthNavigator showOnboarding={false} />} />
        <Route path="/signup/*" element={<AuthNavigator showOnboarding={false} />} />
        <Route path="/register/*" element={<AuthNavigator showOnboarding={false} />} />
        <Route path="/forgot-password/*" element={<AuthNavigator showOnboarding={false} />} />
        <Route path="/verification/*" element={<AuthNavigator showOnboarding={false} />} />
        <Route path="/*" element={<MainNavigator />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppInitializer;
