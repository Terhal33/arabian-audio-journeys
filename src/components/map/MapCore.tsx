
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Tour } from '@/services/toursData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';
import { Bookmark } from './Bookmarks';
import MapBackground from './MapBackground';
import MapLoading from './MapLoading';
import MapOfflineIndicator from './MapOfflineIndicator';
import MapControls from './MapControls';
import UserLocation from './UserLocation';
import GeofenceAlert from './GeofenceAlert';
import BookmarkForm from './BookmarkForm';
import MapPinsLayer from './MapPinsLayer';
import TourPathsLayer from './TourPathsLayer';

interface MapLocation {
  lat: number;
  lng: number;
}

interface MapProps {
  location: MapLocation;
  points?: any[];
  zoom?: number;
  interactive?: boolean;
  className?: string;
  onPinClick?: (location: MapLocation, tour?: Tour) => void;
  onRegionChange?: (region: { lat: number, lng: number, radius: number }) => void;
  showUserLocation?: boolean;
}

const MapCore = ({
  location,
  points = [],
  zoom = 14,
  interactive = true,
  className = 'h-64 w-full',
  onPinClick,
  onRegionChange,
  showUserLocation = true
}: MapProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<MapLocation>(location);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [longPressLocation, setLongPressLocation] = useState<MapLocation | null>(null);
  const [isBookmarkFormOpen, setIsBookmarkFormOpen] = useState(false);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('map_bookmarks', []);
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle location change
  useEffect(() => {
    setMapCenter(location);
    
    // Save last viewed location to localStorage for persistence between sessions
    if (interactive) {
      localStorage.setItem('last_map_location', JSON.stringify(location));
    }
  }, [location.lat, location.lng, interactive]);

  // Load last viewed location on initial render
  useEffect(() => {
    if (interactive) {
      const savedLocation = localStorage.getItem('last_map_location');
      if (savedLocation) {
        try {
          const parsedLocation = JSON.parse(savedLocation);
          if (parsedLocation.lat && parsedLocation.lng) {
            setMapCenter(parsedLocation);
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
      // In a real map implementation, we would increase zoom level here
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
  
  const handleOpenBookmarkForm = () => {
    setLongPressLocation(mapCenter);
    setIsBookmarkFormOpen(true);
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
    // In a real implementation, we would adjust zoom level here
  };
  
  // Find tours to display paths for
  const toursWithPaths = points
    .filter(p => p.tour && (p.tour.id === activeTourId || p.tour.points.length > 0))
    .map(p => p.tour!)
    .filter((tour: Tour, index: number, self: Tour[]) => self.findIndex(t => t.id === tour.id) === index);

  return (
    <div 
      className={`relative bg-oasis-light rounded-lg overflow-hidden ${className}`}
      onMouseDown={(e) => {
        // Only trigger for right mouse button (simulating long press)
        if (e.button === 2) {
          e.preventDefault();
          handleMapLongPress(e);
        }
      }}
      onContextMenu={(e) => {
        // Prevent context menu
        e.preventDefault();
      }}
    >
      {!isMapLoaded ? (
        <MapLoading />
      ) : (
        <>
          {/* Saudi-themed map background with terrain texture */}
          <MapBackground />
          
          {/* Tour paths */}
          <TourPathsLayer 
            tours={toursWithPaths} 
            mapCenter={mapCenter} 
            zoom={zoom}
            activeTourId={activeTourId} 
          />
          
          {/* User's current location */}
          <UserLocation location={location} showUserLocation={showUserLocation} />
          
          {/* All map pins, bookmarks, and clusters */}
          <MapPinsLayer
            points={points}
            bookmarks={bookmarks}
            mapCenter={mapCenter}
            zoom={zoom}
            onPinClick={handlePinClick}
            onClusterClick={handleClusterClick}
            onViewBookmark={handleViewBookmark}
            onLongPress={(point) => {
              setLongPressLocation({ lat: point.lat, lng: point.lng });
              setIsBookmarkFormOpen(true);
            }}
          />
          
          {/* Map controls and compass */}
          <MapControls 
            interactive={interactive}
            onZoomIn={() => {/* In a real map, we would increase zoom here */}}
            onZoomOut={() => {/* In a real map, we would decrease zoom here */}}
            onAddBookmark={handleOpenBookmarkForm}
            showBookmarkButton={true}
          />
          
          {/* Offline mode indicator */}
          <MapOfflineIndicator isOfflineMode={isOfflineMode} />
          
          {/* Geofencing alerts */}
          {interactive && (
            <GeofenceAlert 
              userLocation={location} 
              points={points}
              onViewDetails={(tour) => {
                if (onPinClick) {
                  onPinClick(tour.location, tour);
                  setActiveTourId(tour.id);
                }
              }}
            />
          )}
          
          {/* Bookmark form dialog */}
          <BookmarkForm
            isOpen={isBookmarkFormOpen}
            onClose={() => {
              setIsBookmarkFormOpen(false);
              setLongPressLocation(null);
            }}
            onSave={handleAddBookmark}
            location={longPressLocation}
          />
        </>
      )}
    </div>
  );
};

export default MapCore;
