
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Pages
import HomePage from '@/pages/Home';
import MapPage from '@/pages/Map';
import SearchPage from '@/pages/Search';
import LibraryPage from '@/pages/Library';
import Profile from '@/pages/Profile';
import Tours from '@/pages/Tours';
import TourDetail from '@/pages/TourDetail';
import MainLayout from '@/layouts/MainLayout';

const MainNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Protect all routes inside the main navigator
  if (!isAuthenticated) {
    // Store the current path to redirect back after login
    const currentPath = window.location.pathname;
    localStorage.setItem('redirectAfterLogin', currentPath);
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tour/:id" element={<TourDetail />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default MainNavigator;
