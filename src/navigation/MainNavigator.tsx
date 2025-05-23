
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
import Settings from '@/pages/Settings';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import PremiumRoute from '@/components/PremiumRoute';

// Subscription Pages
import SubscriptionPage from '@/pages/Subscription';
import PaymentMethodPage from '@/pages/PaymentMethod';
import SubscriptionConfirmationPage from '@/pages/SubscriptionConfirmation';
import ReceiptPage from '@/pages/Receipt';
import SubscriptionManagementPage from '@/pages/SubscriptionManagement';
import LanguageSelection from '@/pages/LanguageSelection';

const MainNavigator: React.FC = () => {
  const location = useLocation();
  
  // Update the list to include tours in the MainLayout paths
  const useMainLayout = ['/home', '/map', '/search', '/library', '/profile', '/tours', '/tour/', '/settings'].some(
    path => location.pathname === path || location.pathname.startsWith(path)
  );
  
  // Show debug info
  console.log('MainNavigator - Current path:', location.pathname, 'Using MainLayout:', useMainLayout);
  
  // For routes that should use MainLayout
  if (useMainLayout) {
    return (
      <MainLayout>
        <Routes>
          {/* Redirect root to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* Main navigation routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tour/:id" element={<TourDetail />} />
          
          {/* Protected routes */}
          <Route path="/library" element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Redirect unmatched routes within MainLayout to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </MainLayout>
    );
  }
  
  // For routes that should NOT use MainLayout (subscription and language selection routes)
  return (
    <>
      <Routes>
        {/* Language Selection route */}
        <Route path="/language-selection" element={<LanguageSelection />} />
        
        {/* Subscription routes */}
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/payment-method" element={
          <ProtectedRoute>
            <PaymentMethodPage />
          </ProtectedRoute>
        } />
        <Route path="/subscription-confirmation" element={
          <ProtectedRoute>
            <SubscriptionConfirmationPage />
          </ProtectedRoute>
        } />
        <Route path="/receipt" element={
          <ProtectedRoute>
            <ReceiptPage />
          </ProtectedRoute>
        } />
        <Route path="/subscription-management" element={
          <ProtectedRoute>
            <SubscriptionManagementPage />
          </ProtectedRoute>
        } />
        
        {/* Redirect unmatched routes outside MainLayout to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
};

export default MainNavigator;
