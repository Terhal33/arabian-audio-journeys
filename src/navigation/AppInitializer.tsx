
import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import Splash from '@/pages/Splash';
import AuthNavigator from '@/navigation/AuthNavigator';
import MainNavigator from '@/navigation/MainNavigator';
import NotFound from '@/pages/NotFound';
import { useToast } from '@/hooks/use-toast';

const AppInitializer: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const hasInitialized = useRef(false);
  const isNavigating = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Add debug logs
  console.log('AppInitializer - Auth state:', { 
    isLoading, 
    isAuthenticated, 
    currentPath: location.pathname,
    hasInitialized: hasInitialized.current
  });
  
  // Handle initial routing based on authentication state
  useEffect(() => {
    if (isLoading || hasInitialized.current || isNavigating.current) return;
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      hasInitialized.current = true;
      
      // Define auth paths including /register to avoid redirect issues
      const isAuthPath = location.pathname === '/' || 
                         location.pathname === '/login' || 
                         location.pathname === '/signup';
      
      // Explicitly check if we're already on the register page
      const isOnRegisterPage = location.pathname === '/register';
      
      // Only redirect if on an auth path and not already on register
      if (isAuthPath && !isOnRegisterPage) {
        isNavigating.current = true;
        const hasSeenOnboarding = localStorage.getItem('aaj_onboarded') === 'true';
        const hasSelectedLanguage = localStorage.getItem('aaj_language');
        
        if (!isAuthenticated) {
          // If not authenticated, check language selection first
          if (!hasSelectedLanguage) {
            navigate('/language-selection', { replace: true });
          } else if (!hasSeenOnboarding) {
            // Then check onboarding
            navigate('/onboarding', { replace: true });
            toast({
              title: "Welcome to Arabian Audio",
              description: "Let's get you started with a quick tour",
            });
          } else {
            // Redirect to login page if not on register already
            navigate('/login', { replace: true });
          }
        } else {
          // If authenticated, always direct to home page
          console.log("User is authenticated, redirecting to home page");
          navigate('/home', { replace: true });
          toast({
            title: "Welcome back",
            description: "Continue your journey through Saudi Arabia's history",
            variant: "default",
          });
        }
        
        // Reset navigation flag after a delay
        setTimeout(() => {
          isNavigating.current = false;
        }, 100);
      }
    }, 2500); // Show splash for 2.5 seconds
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, navigate, location.pathname, toast]);
  
  // Show splash screen while loading
  if (showSplash || isLoading) {
    return <Splash />;
  }
  
  // Log the route information
  console.log('AppInitializer rendering routes. Current path:', location.pathname);
  
  return (
    <Routes>
      {/* Language selection - unprotected */}
      <Route path="/language-selection/*" element={<Navigate to="/language-selection" replace />} />
      
      {/* Auth routes - unprotected */}
      <Route path="/onboarding/*" element={<AuthNavigator showOnboarding={true} />} />
      <Route path="/login/*" element={<AuthNavigator showOnboarding={false} />} />
      <Route path="/signup/*" element={<AuthNavigator showOnboarding={false} />} />
      <Route path="/register/*" element={<AuthNavigator showOnboarding={false} />} />
      <Route path="/forgot-password/*" element={<AuthNavigator showOnboarding={false} />} />
      <Route path="/verification/*" element={<AuthNavigator showOnboarding={false} />} />
      
      {/* Protected app routes */}
      <Route path="/*" element={<MainNavigator />} />
      
      {/* Fallback for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppInitializer;
