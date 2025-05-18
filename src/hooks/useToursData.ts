
import { useState, useCallback } from 'react';
import { tours as initialTours, Tour } from '@/services/toursData';
import { useToast } from '@/hooks/use-toast';

interface ToursState {
  featuredTours: Tour[];
  recentTours: Tour[];
  nearbyTours: Tour[];
  recommendedTours: Tour[];
  isLoading: boolean;
  dataLoaded: boolean;
  isRefreshing: boolean;
}

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
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  
  // Initial data load
  const loadData = useCallback(async () => {
    if (state.dataLoaded) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({
        ...prev,
        featuredTours: initialTours.slice(0, 3),
        recentTours: [initialTours[2], initialTours[0], initialTours[1]],
        nearbyTours: initialTours.slice(0, 2),
        recommendedTours: initialTours.slice(1, 3),
        isLoading: false,
        dataLoaded: true
      }));
      
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
  }, [state.dataLoaded, toast]);
  
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
      setState(prev => ({
        ...prev,
        featuredTours: [...initialTours].sort(() => Math.random() - 0.5).slice(0, 3),
        recentTours: [...initialTours].sort(() => Math.random() - 0.5).slice(0, 3),
        nearbyTours: [...initialTours].sort(() => Math.random() - 0.5).slice(0, 2),
        isRefreshing: false
      }));
      
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
  }, [state.isRefreshing, toast]);
  
  // Category selection handler
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
    }, 500);
  }, [selectedCategory]);
  
  // Region selection handler
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
    }, 500);
  }, [selectedRegion]);
  
  return {
    ...state,
    loadData,
    handleRefresh,
    selectedCategory,
    selectedRegion,
    handleCategorySelect,
    handleRegionSelect
  };
};
