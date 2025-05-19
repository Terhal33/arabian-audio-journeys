
import { useState, useCallback, useEffect, useMemo } from 'react';
import { tours as initialTours, Tour } from '@/services/toursData';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ToursState {
  featuredTours: Tour[];
  recentTours: Tour[];
  nearbyTours: Tour[];
  recommendedTours: Tour[];
  isLoading: boolean;
  dataLoaded: boolean;
  isRefreshing: boolean;
}

interface ToursCache {
  timestamp: number;
  data: ToursState;
}

// Cache expiration time (1 hour)
const CACHE_EXPIRATION = 60 * 60 * 1000;

export const useToursData = () => {
  const { toast } = useToast();
  const [state, setState] = useState<ToursState>({
    featuredTours: [],
    recentTours: [],
    nearbyTours: [],
    recommendedTours: [],
    isLoading: true,
    dataLoaded: false,
    isRefreshing: false
  });
  
  const [cachedData, setCachedData] = useLocalStorage<ToursCache | null>('tours_cache', null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  
  // Use cached data if available and not expired
  useEffect(() => {
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRATION)) {
      setState(cachedData.data);
      console.log("Using cached tour data");
    }
  }, [cachedData]);
  
  // Initial data load
  const loadData = useCallback(async () => {
    // Check if we already have valid cached data
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRATION)) {
      if (!state.dataLoaded) {
        setState(cachedData.data);
      }
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we're using local data, but in a real app,
      // this would fetch from an API and possibly incorporate IndexedDB for offline access
      const newState: ToursState = {
        featuredTours: initialTours.slice(0, 3),
        recentTours: [initialTours[2], initialTours[0], initialTours[1]],
        nearbyTours: initialTours.slice(0, 2),
        recommendedTours: initialTours.slice(1, 3),
        isLoading: false,
        dataLoaded: true,
        isRefreshing: false
      };
      
      setState(newState);
      
      // Cache the data with timestamp
      setCachedData({
        timestamp: Date.now(),
        data: newState
      });
      
      console.log("Tours data loaded successfully");
    } catch (error) {
      console.error("Error loading tour data:", error);
      toast({
        title: "Failed to load tours",
        description: "Please check your connection and try again.",
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [setCachedData, state.dataLoaded, toast, cachedData]);
  
  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (state.isRefreshing) return;
    
    setState(prev => ({ ...prev, isRefreshing: true }));
    
    toast({
      title: "Refreshing content",
      description: "Getting the latest tours for you"
    });
    
    // Simulate refresh with timeout
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Shuffle the order of tours to simulate new data
      const newState = {
        featuredTours: [...initialTours].sort(() => Math.random() - 0.5).slice(0, 3),
        recentTours: [...initialTours].sort(() => Math.random() - 0.5).slice(0, 3),
        nearbyTours: [...initialTours].sort(() => Math.random() - 0.5).slice(0, 2),
        recommendedTours: [...initialTours].slice(1, 3),
        isLoading: false,
        dataLoaded: true,
        isRefreshing: false
      };
      
      setState(newState);
      
      // Update cache
      setCachedData({
        timestamp: Date.now(),
        data: newState
      });
      
      toast({
        title: "Content updated",
        description: "You're viewing the latest tours"
      });
    } catch (error) {
      console.error("Error refreshing tour data:", error);
      toast({
        title: "Failed to refresh",
        description: "Please try again later",
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isRefreshing: false }));
    }
  }, [state.isRefreshing, toast, setCachedData]);
  
  // Category selection handler with debounce
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate filtered results with timeout
    setTimeout(() => {
      if (categoryId && categoryId !== selectedCategory) {
        setState(prev => ({
          ...prev,
          featuredTours: initialTours.filter((_, i) => i % 2 === 0),
          recentTours: initialTours.filter((_, i) => i % 2 === 1),
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          featuredTours: initialTours.slice(0, 3),
          recentTours: [initialTours[2], initialTours[0], initialTours[1]],
          isLoading: false
        }));
      }
    }, 300); // Reduced timeout for better UX
  }, [selectedCategory]);
  
  // Region selection handler with debounce
  const handleRegionSelect = useCallback((regionId: string) => {
    setSelectedRegion(regionId === selectedRegion ? '' : regionId);
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate filtered results with timeout
    setTimeout(() => {
      if (regionId && regionId !== selectedRegion) {
        setState(prev => ({
          ...prev,
          featuredTours: initialTours.filter((_, i) => i % 3 === 0),
          nearbyTours: initialTours.filter((_, i) => i % 3 === 1),
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          featuredTours: initialTours.slice(0, 3),
          nearbyTours: initialTours.slice(0, 2),
          isLoading: false
        }));
      }
    }, 300); // Reduced timeout for better UX
  }, [selectedRegion]);

  // Memoize tour data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => ({
    ...state,
    loadData,
    handleRefresh,
    selectedCategory,
    selectedRegion,
    handleCategorySelect,
    handleRegionSelect
  }), [
    state,
    loadData,
    handleRefresh,
    selectedCategory,
    selectedRegion,
    handleCategorySelect,
    handleRegionSelect
  ]);
  
  return memoizedData;
};
