
import { useEffect } from 'react';
import { MapLocation, MapRegion } from '@/types/map';

/**
 * Handles map initialization and event monitoring
 */
export const useMapEffects = (
  location: MapLocation,
  setIsMapLoaded: (loaded: boolean) => void,
  setMapCenter: (location: MapLocation) => void,
  lastNotifiedRegion: MapRegion | null,
  viewportRadius: number,
  interactive: boolean,
  setIsOfflineMode: (isOffline: boolean) => void,
  onRegionChange?: (region: MapRegion) => void
) => {
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
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle location change with debouncing to prevent excessive updates
  useEffect(() => {
    setMapCenter(location);
    
    // Only notify about significant changes to reduce unnecessary data fetching
    if (onRegionChange && shouldUpdateRegion(location, lastNotifiedRegion, viewportRadius)) {
      console.log("Updating map region due to significant location change");
      const newRegion = {
        lat: location.lat,
        lng: location.lng,
        radius: viewportRadius
      };
      
      onRegionChange(newRegion);
    }
    
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
            
            // Notify region change with saved location
            if (onRegionChange && !lastNotifiedRegion) {
              const newRegion = {
                lat: parsedLocation.lat,
                lng: parsedLocation.lng,
                radius: viewportRadius
              };
              
              onRegionChange(newRegion);
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
};

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
