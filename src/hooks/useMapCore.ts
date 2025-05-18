
import { useState, useEffect } from 'react';
import { Tour } from '@/services/toursData';
import { Bookmark } from '@/components/map/Bookmarks';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

interface MapLocation {
  lat: number;
  lng: number;
}

interface MapProps {
  location: MapLocation;
  points?: any[];
  zoom?: number;
  interactive?: boolean;
  onPinClick?: (location: MapLocation, tour?: Tour) => void;
  onRegionChange?: (region: { lat: number, lng: number, radius: number }) => void;
}

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
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
      
      // Notify region change once map is loaded
      if (onRegionChange) {
        onRegionChange({
          lat: location.lat,
          lng: location.lng,
          radius: viewportRadius
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle location change
  useEffect(() => {
    setMapCenter(location);
    
    // Notify region change when location changes
    if (onRegionChange && isMapLoaded) {
      onRegionChange({
        lat: location.lat,
        lng: location.lng,
        radius: viewportRadius
      });
    }
    
    // Save last viewed location to localStorage for persistence between sessions
    if (interactive) {
      localStorage.setItem('last_map_location', JSON.stringify(location));
    }
  }, [location.lat, location.lng, interactive, isMapLoaded, onRegionChange, viewportRadius]);

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
            if (onRegionChange) {
              onRegionChange({
                lat: parsedLocation.lat,
                lng: parsedLocation.lng,
                radius: viewportRadius
              });
            }
          }
        } catch (e) {
          console.error('Error parsing saved location', e);
        }
      }
    }
  }, [interactive, onRegionChange, viewportRadius]);

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
      setViewportRadius(Math.max(2, viewportRadius * 0.7));
      
      // Notify region change with new center and radius
      if (onRegionChange) {
        onRegionChange({
          lat: center.lat,
          lng: center.lng,
          radius: Math.max(2, viewportRadius * 0.7)
        });
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
      onRegionChange({
        lat: bookmark.lat,
        lng: bookmark.lng,
        radius: viewportRadius
      });
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
    setViewportRadius(Math.max(1, viewportRadius * 0.7));
    
    // Notify region change with new radius
    if (onRegionChange) {
      onRegionChange({
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        radius: Math.max(1, viewportRadius * 0.7)
      });
    }
  };
  
  const handleZoomOut = () => {
    // Increase viewport radius to simulate zoom out
    setViewportRadius(viewportRadius * 1.5);
    
    // Notify region change with new radius
    if (onRegionChange) {
      onRegionChange({
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        radius: viewportRadius * 1.5
      });
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
