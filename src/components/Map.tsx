
import { useEffect, useRef, useState } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  location: Location;
  points?: Location[];
  className?: string;
  interactive?: boolean;
  onPinClick?: (location: Location, tour?: any) => void;
  onRegionChange?: (region: any) => void;
  showUserLocation?: boolean;
  onLongPress?: (location: { lat: number; lng: number }) => void;
}

const Map = ({ 
  location, 
  points = [], 
  className = '',
  interactive = true,
  onPinClick,
  onRegionChange,
  showUserLocation = true,
  onLongPress
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simple map initialization without infinite loops
    if (mapRef.current && !mapLoaded) {
      console.log('Map: Initializing with location:', location);
      setMapLoaded(true);
    }
  }, [location.lat, location.lng, mapLoaded]);

  const handleClick = (e: React.MouseEvent) => {
    if (!interactive || !onPinClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simple click handling - you can enhance this
    console.log('Map clicked at:', x, y);
  };

  const handleLongPress = (e: React.MouseEvent) => {
    if (!interactive || !onLongPress) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert screen coordinates to lat/lng (simplified)
    const lat = location.lat + (y - rect.height / 2) * 0.0001;
    const lng = location.lng + (x - rect.width / 2) * 0.0001;
    
    onLongPress({ lat, lng });
  };

  return (
    <div 
      ref={mapRef}
      className={`bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer ${className}`}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        handleLongPress(e);
      }}
    >
      <div className="text-center p-4">
        <div className="text-gray-600 mb-2">📍 Map View</div>
        <div className="text-sm text-gray-500">
          Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </div>
        {points.length > 0 && (
          <div className="text-xs text-gray-400 mt-1">
            {points.length} point{points.length !== 1 ? 's' : ''} of interest
          </div>
        )}
        {interactive && (
          <div className="text-xs text-gray-300 mt-2">
            Right-click to add bookmark
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
