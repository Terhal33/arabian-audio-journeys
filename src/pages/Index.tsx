
import React, { useState, useEffect } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { tours, Tour } from '@/services/toursData';
import { useAuth } from '@/contexts/auth/AuthProvider';
import HeroSection from '@/components/home/HeroSection';
import HeritageSection from '@/components/home/HeritageSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import Footer from '@/components/home/Footer';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { navigateTo } = useAppState();
  const [allTours, setAllTours] = useState<Tour[]>([]);

  useEffect(() => {
    // Since tours data is static, we can set it directly without error handling
    setAllTours(tours);
  }, []);

  const handleNavigation = (destination: string) => {
    navigateTo(destination);
  };

  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen">
        <HeroSection 
          isAuthenticated={isAuthenticated} 
          onNavigate={handleNavigation} 
        />
        <HeritageSection tours={allTours} />
        <HowItWorksSection />
        <CallToActionSection onNavigate={handleNavigation} />
        <Footer onNavigate={handleNavigation} />
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default Index;
