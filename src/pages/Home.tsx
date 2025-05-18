
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { categories, regions } from '@/services/categoryData';
import { Button } from '@/components/ui/button';
import WelcomeHeader from '@/components/WelcomeHeader';
import TourCarousel from '@/components/TourCarousel';
import NearbyAttractions from '@/components/NearbyAttractions';
import UpgradePrompt from '@/components/UpgradePrompt';
import LoadingSpinner from '@/components/LoadingSpinner';

// Custom hooks
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToursData } from '@/hooks/useToursData';

// Home components
import PullToRefresh from '@/components/home/PullToRefresh';
import OfflineAlert from '@/components/home/OfflineAlert';
import RecentlyAddedTours from '@/components/home/RecentlyAddedTours';
import RecommendedTours from '@/components/home/RecommendedTours';
import ContinueListening from '@/components/home/ContinueListening';
import ExploreByTabs from '@/components/home/ExploreByTabs';

const HomePage = () => {
  const { user, isPremium } = useAuth();
  const isOnline = useOnlineStatus();
  const { location, locationName } = useGeolocation();
  
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
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Show loading spinner while data is being initially loaded
  if (isLoading && !dataLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner size="large" text="Loading tours..." />
      </div>
    );
  }
  
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
            <ContinueListening />
          </div>
        </PullToRefresh>
      </main>
    </div>
  );
};

export default HomePage;
