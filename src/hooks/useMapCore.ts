
import { useState, useEffect } from 'react';
import { Tour } from '@/services/toursData';
import { Bookmark } from '@/components/map/Bookmarks';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';
import { MapLocation, MapProps, MapRegion } from '@/types/map';

const useMapCore = ({
  location,
  points = [],
  zoom = 14,
  interactive = true,
  onPinClick,
  onRegionChange
}: MapProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<MapLocation>(location);
  const [viewportRadius, setViewportRadius] = useState<number>(5); // km
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [longPressLocation, setLongPressLocation] = useState<MapLocation | null>(null);
  const [isBookmarkFormOpen, setIsBookmarkFormOpen] = useState(false);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('map_bookmarks', []);
  const [lastNotifiedRegion, setLastNotifiedRegion] = useState<MapRegion | null>(null);
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
      
      // Notify region change once map is loaded
      if (onRegionChange) {
        const newRegion = {
          lat: location.lat,
          lng: location.lng,
          radius: viewportRadius
        };
        
        onRegionChange(newRegion);
        setLastNotifiedRegion(newRegion);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle location change with debouncing to prevent excessive updates
  useEffect(() => {
    setMapCenter(location);
    
    // Only notify about significant changes to reduce unnecessary data fetching
    if (onRegionChange && isMapLoaded && shouldUpdateRegion(location, lastNotifiedRegion, viewportRadius)) {
      console.log("Updating map region due to significant location change");
      const newRegion = {
        lat: location.lat,
        lng: location.lng,
        radius: viewportRadius
      };
      
      onRegionChange(newRegion);
      setLastNotifiedRegion(newRegion);
    }
    
    // Save last viewed location to localStorage for persistence between sessions
    if (interactive) {
      localStorage.setItem('last_map_location', JSON.stringify(location));
    }
  }, [location.lat, location.lng, interactive, isMapLoaded]);

  // Load last viewed location on initial render
  useEffect(() => {
    if (interactive) {
      const savedLocation = localStorage.getItem('last_map_location');
      if (savedLocation) {
        try {
          const parsedLocation = JSON.parse(savedLocation);
          if (parsedLocation.lat && parsedLocation.lng) {
            setMapCenter(parsedLocation);
            
            // Notify region change with saved location
            if (onRegionChange && !lastNotifiedRegion) {
              const newRegion = {
                lat: parsedLocation.lat,
                lng: parsedLocation.lng,
                radius: viewportRadius
              };
              
              onRegionChange(newRegion);
              setLastNotifiedRegion(newRegion);
            }
          }
        } catch (e) {
          console.error('Error parsing saved location', e);
        }
      }
    }
  }, [interactive]);

  // Simulate offline detection
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Helper function to determine if we should update the region
  const shouldUpdateRegion = (
    currentLocation: MapLocation, 
    lastRegion: MapRegion | null, 
    radius: number
  ): boolean => {
    if (!lastRegion) return true;
    
    // Calculate distance between current location and last notified region
    const distance = calculateDistance(
      currentLocation.lat, 
      currentLocation.lng, 
      lastRegion.lat, 
      lastRegion.lng
    );
    
    // Update if we've moved more than 30% of the viewport radius
    return distance > (radius * 0.3);
  };
  
  // Calculate distance between two points in km using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };
  
  const handlePinClick = (point: any) => {
    if (onPinClick && interactive) {
      onPinClick(point, point.tour);
      
      // Set active tour for highlighting path
      if (point.tour) {
        setActiveTourId(point.tour.id);
      }
    }
  };

  const handleClusterClick = (center: MapLocation) => {
    if (interactive) {
      // Zoom in when clicking a cluster
      setMapCenter(center);
      
      // Decrease viewport radius to simulate zoom in
      const newRadius = Math.max(2, viewportRadius * 0.7);
      setViewportRadius(newRadius);
      
      // Notify region change with new center and radius
      if (onRegionChange) {
        const newRegion = {
          lat: center.lat,
          lng: center.lng,
          radius: newRadius
        };
        
        onRegionChange(newRegion);
        setLastNotifiedRegion(newRegion);
      }
    }
  };
  
  const handleMapLongPress = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    
    // Get click coordinates relative to the map container
    const mapRect = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - mapRect.left) / mapRect.width;
    const relativeY = (e.clientY - mapRect.top) / mapRect.height;
    
    // Convert to geo coordinates (simplified for demo)
    const lng = mapCenter.lng + (relativeX - 0.5) * (0.1 / zoom);
    const lat = mapCenter.lat - (relativeY - 0.5) * (0.05 / zoom);
    
    setLongPressLocation({ lat, lng });
    setIsBookmarkFormOpen(true);
  };
  
  const handleOpenBookmarkForm = (point: MapLocation | null = null) => {
    if (point) {
      setLongPressLocation(point);
    } else if (!longPressLocation) {
      setLongPressLocation(mapCenter);
    }
    setIsBookmarkFormOpen(!isBookmarkFormOpen);
  };
  
  const handleAddBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmarkData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setBookmarks([...bookmarks, newBookmark]);
    
    toast({
      title: "Bookmark created",
      description: `${newBookmark.name} has been added to your bookmarks`,
    });
    
    setIsBookmarkFormOpen(false);
    setLongPressLocation(null);
  };
  
  const handleViewBookmark = (bookmark: Bookmark) => {
    setMapCenter({ lat: bookmark.lat, lng: bookmark.lng });
    
    // Notify region change with bookmark location
    if (onRegionChange) {
      const newRegion = {
        lat: bookmark.lat,
        lng: bookmark.lng,
        radius: viewportRadius
      };
      
      onRegionChange(newRegion);
      setLastNotifiedRegion(newRegion);
    }
  };
  
  // Find tours to display paths for
  const toursWithPaths = points
    .filter(p => p.tour && (p.tour.id === activeTourId || p.tour.points.length > 0))
    .map(p => p.tour!)
    .filter((tour: Tour, index: number, self: Tour[]) => 
      self.findIndex(t => t.id === tour.id) === index);

  const handleZoomIn = () => {
    // Decrease viewport radius to simulate zoom in
    const newRadius = Math.max(1, viewportRadius * 0.7);
    setViewportRadius(newRadius);
    
    // Notify region change with new radius
    if (onRegionChange) {
      const newRegion = {
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        radius: newRadius
      };
      
      onRegionChange(newRegion);
      setLastNotifiedRegion(newRegion);
    }
  };
  
  const handleZoomOut = () => {
    // Increase viewport radius to simulate zoom out
    const newRadius = viewportRadius * 1.5;
    setViewportRadius(newRadius);
    
    // Notify region change with new radius
    if (onRegionChange) {
      const newRegion = {
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        radius: newRadius
      };
      
      onRegionChange(newRegion);
      setLastNotifiedRegion(newRegion);
    }
  };

  return {
    isMapLoaded,
    mapCenter,
    viewportRadius,
    isOfflineMode,
    activeTourId,
    longPressLocation,
    isBookmarkFormOpen,
    bookmarks,
    handlePinClick,
    handleClusterClick,
    handleMapLongPress,
    handleOpenBookmarkForm,
    handleAddBookmark,
    handleViewBookmark,
    handleZoomIn,
    handleZoomOut,
    toursWithPaths,
    setActiveTourId
  };
};

export default useMapCore;
