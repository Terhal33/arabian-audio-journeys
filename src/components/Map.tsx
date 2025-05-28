
import { useEffect, useRef, useState } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  location: Location;
  points?: Location[];
  className?: string;
}

const Map = ({ location, points = [], className = '' }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simple map initialization without infinite loops
    if (mapRef.current && !mapLoaded) {
      console.log('Map: Initializing with location:', location);
      setMapLoaded(true);
    }
  }, [location.lat, location.lng, mapLoaded]);

  return (
    <div 
      ref={mapRef}
      className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}
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
      </div>
    </div>
  );
};

export default Map;
