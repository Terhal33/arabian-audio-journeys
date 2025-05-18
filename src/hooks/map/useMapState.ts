
import { useState } from 'react';
import { MapLocation, MapRegion } from '@/types/map';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Bookmark } from '@/components/map/Bookmarks';
import { Tour } from '@/services/toursData';

/**
 * Hook for managing map state
 */
export const useMapState = () => {
  // Map loading and view state
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<MapLocation>({ lat: 0, lng: 0 });
  const [viewportRadius, setViewportRadius] = useState<number>(5); // km
  
  // Feature toggles and mode indicators
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  
  // Bookmark related state
  const [longPressLocation, setLongPressLocation] = useState<MapLocation | null>(null);
  const [isBookmarkFormOpen, setIsBookmarkFormOpen] = useState(false);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('map_bookmarks', []);
  
  // Region tracking for data fetching optimization
  const [lastNotifiedRegion, setLastNotifiedRegion] = useState<MapRegion | null>(null);
  
  // Selection state
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  
  return {
    // Map view state
    isMapLoaded,
    setIsMapLoaded,
    mapCenter,
    setMapCenter,
    viewportRadius,
    setViewportRadius,
    
    // Feature toggles
    isOfflineMode,
    setIsOfflineMode,
    activeTourId,
    setActiveTourId,
    
    // Bookmark state
    longPressLocation,
    setLongPressLocation,
    isBookmarkFormOpen,
    setIsBookmarkFormOpen,
    bookmarks,
    setBookmarks,
    
    // Region tracking
    lastNotifiedRegion,
    setLastNotifiedRegion,
    
    // Tour selection
    selectedTour,
    setSelectedTour
  };
};
