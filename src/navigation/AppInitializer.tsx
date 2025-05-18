
import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Splash from '@/pages/Splash';
import AuthNavigator from '@/navigation/AuthNavigator';
import MainNavigator from '@/navigation/MainNavigator';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';

const AppInitializer: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const hasInitialized = useRef(false);
  const isNavigating = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle initial routing based on authentication state
  useEffect(() => {
    if (isLoading || hasInitialized.current || isNavigating.current) return;
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      hasInitialized.current = true;
      
      // Only redirect if we're on the root path
      if (location.pathname === '/') {
        isNavigating.current = true;
        const hasSeenOnboarding = localStorage.getItem('aaj_onboarded') === 'true';
        
        if (!isAuthenticated) {
          // If not authenticated, direct to onboarding or login
          if (!hasSeenOnboarding) {
            navigate('/onboarding', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        } else {
          // If authenticated, direct to home
          navigate('/home', { replace: true });
        }
        
        // Reset navigation flag after a delay
        setTimeout(() => {
          isNavigating.current = false;
        }, 100);
      }
    }, 2000); // Show splash for 2 seconds
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, navigate, location.pathname]);
  
  // Show splash screen while loading
  if (showSplash || isLoading) {
    return <Splash />;
  }
  
  return (
    <Routes>
      {/* Auth routes - unprotected */}
      <Route path="/onboarding/*" element={<AuthNavigator showOnboarding={true} />} />
      <Route path="/login/*" element={<AuthNavigator showOnboarding={false} />} />
      <Route path="/signup/*" element={<AuthNavigator showOnboarding={false} />} />
      <Route path="/forgot-password/*" element={<AuthNavigator showOnboarding={false} />} />
      <Route path="/verification/*" element={<AuthNavigator showOnboarding={false} />} />
      
      {/* Protected app routes */}
      <Route path="/*" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      
      {/* Fallback for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppInitializer;
