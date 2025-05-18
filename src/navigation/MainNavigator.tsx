
import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Extract the base route (e.g., /home, /profile, etc.)
  const baseRoute = `/${currentPath.split('/')[1]}`;
  
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
        
        {/* Redirect to first tab if no match found */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default MainNavigator;
