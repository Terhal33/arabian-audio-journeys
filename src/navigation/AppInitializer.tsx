
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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle initial routing based on authentication state
  useEffect(() => {
    if (isLoading || hasInitialized.current) return;
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      hasInitialized.current = true;
      
      // Only redirect if we're on the root path
      if (location.pathname === '/') {
        const hasSeenOnboarding = localStorage.getItem('aaj_onboarded') === 'true';
        
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
  }, [isLoading, isAuthenticated, navigate, location.pathname]);
  
  // Show splash screen while loading
  if (showSplash || isLoading) {
    return <Splash />;
  }
  
  // Define the route structure
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/onboarding/*" element={<AuthNavigator showOnboarding={true} />} />
      <Route path="/login/*" element={<AuthNavigator showOnboarding={false} />} />
      <Route path="/signup/*" element={<AuthNavigator showOnboarding={false} />} />
      <Route path="/forgot-password/*" element={<AuthNavigator showOnboarding={false} />} />
      <Route path="/verification/*" element={<AuthNavigator showOnboarding={false} />} />
      
      {/* Protected app routes - all main app functionality should be under these routes */}
      <Route path="/home/*" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/map/*" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/search/*" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/library/*" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/profile/*" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/tours/*" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/tour/:id" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      
      {/* Redirect root to appropriate path */}
      <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
      
      {/* Fallback for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppInitializer;
