
import React, { useEffect, lazy } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { categories, regions } from '@/services/categoryData';
import { Button } from '@/components/ui/button';
import WelcomeHeader from '@/components/WelcomeHeader';
import TourCarousel from '@/components/TourCarousel';
import NearbyAttractions from '@/components/NearbyAttractions';
import LoadingSpinner from '@/components/LoadingSpinner';
import SuspenseWrapper from '@/components/SuspenseWrapper';
import { useNetwork } from '@/contexts/NetworkContext';

// Custom hooks
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToursData } from '@/hooks/useToursData';

// Home components
import PullToRefresh from '@/components/home/PullToRefresh';
import OfflineAlert from '@/components/home/OfflineAlert';
import RecentlyAddedTours from '@/components/home/RecentlyAddedTours';
import ExploreByTabs from '@/components/home/ExploreByTabs';

// Lazy load non-critical components
const RecommendedTours = lazy(() => import('@/components/home/RecommendedTours'));
const ContinueListening = lazy(() => import('@/components/home/ContinueListening'));
const UpgradePrompt = lazy(() => import('@/components/UpgradePrompt'));
const OnboardingTutorial = lazy(() => import('@/components/OnboardingTutorial'));

const HomePage = () => {
  const { user, isPremium } = useAuth();
  const isOnline = useOnlineStatus();
  const { location, locationName } = useGeolocation();
  const { prefetchResources } = useNetwork();
  
  const {
    featuredTours,
    recentTours,
    nearbyTours,
    recommendedTours,
    isLoading,
    dataLoaded,
    isRefreshing,
    loadData,
    handleRefresh,
    selectedCategory,
    selectedRegion,
    handleCategorySelect,
    handleRegionSelect
  } = useToursData();
  
  // Check last tour from local storage
  const [lastTour, setLastTour] = React.useState<{id: string, title: string, progress: number} | null>(null);
  const [showTutorial, setShowTutorial] = React.useState<boolean>(false);
  
  // Check if this is first visit to show tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('seen_home_tutorial');
    if (!hasSeenTutorial) {
      // Delay showing tutorial to ensure UI is loaded
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Mark tutorial as seen
  const handleTutorialComplete = () => {
    localStorage.setItem('seen_home_tutorial', 'true');
    setShowTutorial(false);
  };
  
  useEffect(() => {
    const storedLastTour = localStorage.getItem('last_tour');
    if (storedLastTour) {
      try {
        setLastTour(JSON.parse(storedLastTour));
      } catch (e) {
        console.error("Error parsing last tour data", e);
      }
    }
  }, []);
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Prefetch tour images when data is loaded
  useEffect(() => {
    if (featuredTours.length > 0) {
      const tourImages = featuredTours.map(tour => tour.imageUrl);
      prefetchResources(tourImages);
    }
  }, [featuredTours, prefetchResources]);
  
  // Show loading spinner while data is being initially loaded
  if (isLoading && !dataLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner size="large" text="Loading tours..." />
      </div>
    );
  }
  
  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Saudi Tours",
      description: "Discover the rich cultural heritage of Saudi Arabia through immersive audio tours.",
    },
    {
      title: "Browse Featured Tours",
      description: "Explore our handpicked selection of must-visit locations and experiences.",
    },
    {
      title: "Filter by Categories",
      description: "Find tours that match your interests - historical sites, nature, or cultural experiences.",
    },
    {
      title: "Save Your Favorites",
      description: "Bookmark tours for offline access and quick reference.",
    },
    {
      title: "Ready to Explore?",
      description: "Tap on any tour to see details and start your audio journey.",
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-6 bg-sand-light">
        <OfflineAlert isOffline={!isOnline} />
        
        <PullToRefresh 
          onRefresh={handleRefresh} 
          isRefreshing={isRefreshing}
        >
          <div className="container mx-auto px-4 pb-16">
            {/* Welcome Header with Location */}
            <WelcomeHeader location={locationName} isLoading={isLoading} />
            
            {/* Featured Tours Carousel */}
            <TourCarousel 
              title="Featured Tours" 
              tours={featuredTours} 
              viewAllLink="/tours"
              isLoading={isLoading || isRefreshing}
            />
            
            {/* Categories Section */}
            <ExploreByTabs 
              categories={categories}
              regions={regions}
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              onSelectCategory={handleCategorySelect}
              onSelectRegion={handleRegionSelect}
              isLoading={isLoading}
            />
            
            {/* Recently Added Tours */}
            <RecentlyAddedTours tours={recentTours} isLoading={isLoading} />
            
            {/* Nearby Attractions */}
            <NearbyAttractions 
              tours={nearbyTours}
              userLocation={location}
              isLoading={isLoading}
            />
            
            {/* Use SuspenseWrapper for non-critical components */}
            <SuspenseWrapper fallback={<div className="h-20 flex items-center justify-center"><LoadingSpinner size="small" /></div>}>
              {/* Premium Upgrade Prompt */}
              {!isPremium && (
                <div className="mb-8">
                  <UpgradePrompt
                    title="Unlock Premium Tours"
                    description="Get unlimited access to all 50+ premium tours and exclusive content!"
                    buttonText="Upgrade to Premium"
                    onUpgrade={() => console.log("Upgrade clicked")}
                  />
                </div>
              )}
              
              {/* Personalized Recommendations */}
              <RecommendedTours 
                tours={recommendedTours} 
                isPremium={isPremium || false} 
                isLoading={isLoading} 
              />
              
              {/* Continue Listening Section */}
              <ContinueListening isLoading={isLoading} lastTour={lastTour} />
            </SuspenseWrapper>
          </div>
        </PullToRefresh>
        
        {/* Onboarding Tutorial */}
        <SuspenseWrapper>
          {showTutorial && (
            <OnboardingTutorial
              steps={tutorialSteps}
              onComplete={handleTutorialComplete}
              showOnlyOnce={true}
              tutorialId="home_tutorial"
            />
          )}
        </SuspenseWrapper>
      </main>
    </div>
  );
};

export default HomePage;
