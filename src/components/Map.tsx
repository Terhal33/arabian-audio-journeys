
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Tour } from '@/services/toursData';
import MapPin from './map/MapPin';
import MapCluster from './map/MapCluster';
import MapControls from './map/MapControls';
import MapLoading from './map/MapLoading';
import UserLocation from './map/UserLocation';
import MapOfflineIndicator from './map/MapOfflineIndicator';
import MapBackground from './map/MapBackground';
import { useMapClustering, MapPin as MapPinType } from './map/useMapClustering';

interface MapLocation {
  lat: number;
  lng: number;
}

interface MapProps {
  location: MapLocation;
  points?: MapPinType[];
  zoom?: number;
  interactive?: boolean;
  className?: string;
  onPinClick?: (location: MapLocation, tour?: Tour) => void;
  onRegionChange?: (region: { lat: number, lng: number, radius: number }) => void;
  showUserLocation?: boolean;
}

// A more advanced map placeholder that simulates a real map with Saudi terrain
const Map = ({
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
  const { clusters, filteredPoints } = useMapClustering(points);
  
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
  }, [location.lat, location.lng]);

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
  
  const handlePinClick = (point: MapPinType) => {
    if (onPinClick && interactive) {
      onPinClick(point, point.tour);
    }
  };

  const handleClusterClick = (center: MapLocation) => {
    if (onPinClick && interactive) {
      onPinClick(center);
    }
  };

  return (
    <div className={`relative bg-oasis-light rounded-lg overflow-hidden ${className}`}>
      {!isMapLoaded ? (
        <MapLoading />
      ) : (
        <>
          {/* Saudi-themed map background with terrain texture */}
          <MapBackground />
          
          {/* User's current location */}
          <UserLocation location={location} showUserLocation={showUserLocation} />
          
          {/* Regular pins */}
          {filteredPoints.map((point, index) => (
            <MapPin 
              key={point.id || index}
              point={point}
              mapCenter={mapCenter}
              zoom={zoom}
              onClick={handlePinClick}
            />
          ))}
          
          {/* Cluster markers */}
          {clusters.map((cluster, index) => (
            <MapCluster
              key={`cluster-${index}`}
              cluster={cluster}
              mapCenter={mapCenter}
              zoom={zoom}
              onClick={handleClusterClick}
            />
          ))}
          
          {/* Map controls and compass */}
          <MapControls interactive={interactive} />
          
          {/* Offline mode indicator */}
          <MapOfflineIndicator isOfflineMode={isOfflineMode} />
        </>
      )}
    </div>
  );
};

export default Map;
