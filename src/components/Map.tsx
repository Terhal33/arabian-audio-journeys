
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface MapLocation {
  lat: number;
  lng: number;
}

interface MapProps {
  location: MapLocation;
  points?: MapLocation[];
  zoom?: number;
  interactive?: boolean;
  className?: string;
  onPinClick?: (location: MapLocation) => void;
}

// A minimalist map placeholder that will be replaced with react-native-maps in a real implementation
const Map = ({
  location,
  points = [],
  zoom = 14,
  interactive = true,
  className = 'h-64 w-full',
  onPinClick
}: MapProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handlePinClick = (pointLocation: MapLocation) => {
    if (onPinClick && interactive) {
      onPinClick(pointLocation);
    }
  };
  
  return (
    <div className={`relative bg-oasis-light rounded-lg overflow-hidden ${className}`}>
      {!isMapLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse flex space-x-2 justify-center items-center">
            <div className="h-2 w-2 bg-oasis rounded-full"></div>
            <div className="h-2 w-2 bg-oasis rounded-full"></div>
            <div className="h-2 w-2 bg-oasis rounded-full"></div>
          </div>
        </div>
      ) : (
        <>
          {/* This is a placeholder for a real map */}
          <div className="absolute inset-0 bg-sand-light bg-opacity-20 z-0">
            {/* Map grid lines */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 64 }).map((_, i) => (
                <div 
                  key={i} 
                  className="border border-oasis-light border-opacity-30"
                ></div>
              ))}
            </div>
          </div>
          
          {/* Main pin */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-desert-dark p-1 rounded-full shadow-lg animate-pulse-slow">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {/* Additional pins */}
          {points.map((point, index) => {
            // Calculate relative position based on difference from center location
            const latDiff = point.lat - location.lat;
            const lngDiff = point.lng - location.lng;
            
            // Convert to screen position (simplified)
            const x = 50 + (lngDiff * zoom * 200); // percentage from center
            const y = 50 - (latDiff * zoom * 200); // percentage from center
            
            return (
              <div 
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                style={{
                  left: `${x}%`,
                  top: `${y}%`
                }}
                onClick={() => handlePinClick(point)}
              >
                <div className="bg-oasis p-1 rounded-full shadow-md hover:bg-oasis-dark transition-colors">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </div>
            );
          })}
          
          {/* Map controls (dummy) */}
          {interactive && (
            <div className="absolute right-4 top-4 flex flex-col space-y-2 z-20">
              <button className="bg-white p-1 rounded shadow-md text-muted-foreground hover:text-foreground">
                <span className="text-xl">+</span>
              </button>
              <button className="bg-white p-1 rounded shadow-md text-muted-foreground hover:text-foreground">
                <span className="text-xl">−</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Map;
