import { useState, useEffect } from 'react';
import { MapPin, MapPinOff, Compass, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tour } from '@/services/toursData';

interface MapLocation {
  lat: number;
  lng: number;
}

interface MapPin extends MapLocation {
  id?: string;
  type?: 'historic' | 'cultural' | 'religious' | 'nature' | 'modern' | 'user';
  isPremium?: boolean;
  tour?: Tour;
}

interface MapProps {
  location: MapLocation;
  points?: MapPin[];
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
  const [clusters, setClusters] = useState<Array<{ center: MapLocation, count: number }>>([]);
  const [mapCenter, setMapCenter] = useState<MapLocation>(location);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
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
  
  // Simulate clustering algorithm based on points proximity
  useEffect(() => {
    if (points.length < 5) {
      setClusters([]);
      return;
    }
    
    // Simple clustering simulation
    const newClusters = [];
    const gridSize = 0.05; // Approximately 5km grid
    // Fix: Create Map object without type parameters in the constructor
    const gridMap = new Map();
    
    points.forEach(point => {
      // Create a grid cell key
      const gridX = Math.floor(point.lat / gridSize);
      const gridY = Math.floor(point.lng / gridSize);
      const key = `${gridX}:${gridY}`;
      
      if (!gridMap.has(key)) {
        gridMap.set(key, { points: [], center: { lat: 0, lng: 0 } });
      }
      
      const cell = gridMap.get(key);
      if (cell) {
        cell.points.push(point);
        
        // Recalculate center
        cell.center.lat = cell.points.reduce((sum, p) => sum + p.lat, 0) / cell.points.length;
        cell.center.lng = cell.points.reduce((sum, p) => sum + p.lng, 0) / cell.points.length;
      }
    });
    
    // Convert clusters with more than 3 points
    gridMap.forEach(cell => {
      if (cell.points.length > 3) {
        newClusters.push({
          center: cell.center,
          count: cell.points.length
        });
      }
    });
    
    setClusters(newClusters);
  }, [points]);
  
  const handlePinClick = (point: MapPin) => {
    if (onPinClick && interactive) {
      onPinClick(point, point.tour);
    }
  };

  // Generate the pin color based on type and premium status
  const getPinColor = (type?: string, isPremium?: boolean) => {
    if (isPremium) return 'bg-gold';
    
    switch (type) {
      case 'historic': return 'bg-amber-600';
      case 'cultural': return 'bg-purple-600';
      case 'religious': return 'bg-green-600';
      case 'nature': return 'bg-emerald-600';
      case 'modern': return 'bg-blue-600';
      case 'user': return 'bg-desert-dark';
      default: return 'bg-oasis';
    }
  };

  const hasUserLocation = showUserLocation && location && location.lat && location.lng;
  
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
          {/* Saudi-themed map background with terrain texture */}
          <div className="absolute inset-0 bg-sand-light z-0">
            {/* Simulated terrain patterns */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="sand-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M0 50 Q25 0 50 50 Q75 100 100 50" stroke="#8A650B" strokeWidth="0.5" fill="none" />
                  <path d="M0 25 Q25 75 50 25 Q75 -25 100 25" stroke="#8A650B" strokeWidth="0.5" fill="none" />
                  <path d="M0 75 Q25 25 50 75 Q75 125 100 75" stroke="#8A650B" strokeWidth="0.5" fill="none" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#sand-pattern)" />
              </svg>
            </div>
            
            {/* Grid lines for map appearance */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 64 }).map((_, i) => (
                <div 
                  key={i} 
                  className="border border-oasis-light border-opacity-20"
                ></div>
              ))}
            </div>
          </div>
          
          {/* User's current location */}
          {hasUserLocation && (
            <div 
              className="absolute z-20"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative">
                {/* Accuracy circle */}
                <div className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-blue-500 bg-opacity-20 animate-pulse"></div>
                
                {/* Location dot */}
                <div className="absolute -translate-x-1/2 -translate-y-1/2 bg-blue-500 h-4 w-4 rounded-full border-2 border-white shadow-lg"></div>
              </div>
            </div>
          )}
          
          {/* Regular pins */}
          {points.filter(point => {
            // Filter out points that would be in clusters
            const isInCluster = clusters.some(cluster => {
              const distance = Math.sqrt(
                Math.pow(cluster.center.lat - point.lat, 2) + 
                Math.pow(cluster.center.lng - point.lng, 2)
              );
              return distance < 0.05; // Same as gridSize
            });
            
            return !isInCluster;
          }).map((point, index) => (
            <div 
              key={point.id || index}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer",
                point.isPremium ? "filter drop-shadow-lg" : ""
              )}
              style={{
                // Calculate position based on difference from center and zoom
                left: `${50 + (point.lng - mapCenter.lng) * zoom * 200}%`, 
                top: `${50 - (point.lat - mapCenter.lat) * zoom * 200}%`
              }}
              onClick={() => handlePinClick(point)}
            >
              <div className={cn(
                "group relative flex flex-col items-center",
                point.isPremium ? "animate-pulse-slow" : ""
              )}>
                {/* Pin shadow */}
                <div className="absolute -bottom-1 w-3 h-1 bg-black/20 rounded-full"></div>
                
                {/* Pin */}
                <div className={cn(
                  "p-1 rounded-full shadow-md transition-all hover:scale-110",
                  getPinColor(point.type, point.isPremium),
                  point.isPremium ? "ring-2 ring-gold ring-opacity-50" : ""
                )}>
                  <MapPin className={cn(
                    "h-4 w-4",
                    point.isPremium ? "text-black" : "text-white"
                  )} />
                </div>
                
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap transition-opacity">
                  {point.tour?.title || 'Location'}
                  {point.isPremium && (
                    <span className="ml-1 text-gold">✦</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Cluster markers */}
          {clusters.map((cluster, index) => (
            <div 
              key={`cluster-${index}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
              style={{
                left: `${50 + (cluster.center.lng - mapCenter.lng) * zoom * 200}%`,
                top: `${50 - (cluster.center.lat - mapCenter.lat) * zoom * 200}%`
              }}
              onClick={() => {
                // Zoom in on cluster when clicked
                if (onPinClick) {
                  onPinClick(cluster.center);
                }
              }}
            >
              <div className="bg-desert rounded-full shadow-lg flex items-center justify-center h-8 w-8 text-white text-xs font-medium border border-white">
                {cluster.count}
              </div>
            </div>
          ))}
          
          {/* Map controls (dummy) */}
          {interactive && (
            <div className="absolute right-4 top-4 flex flex-col space-y-2 z-20">
              <button className="bg-white p-2 rounded-full shadow-md text-muted-foreground hover:text-foreground transition">
                <span className="text-xl">+</span>
              </button>
              <button className="bg-white p-2 rounded-full shadow-md text-muted-foreground hover:text-foreground transition">
                <span className="text-xl">−</span>
              </button>
            </div>
          )}
          
          {/* Compass rose */}
          <div className="absolute left-4 bottom-4 z-20">
            <div className="bg-white bg-opacity-80 backdrop-blur-sm p-2 rounded-full shadow-md">
              <Compass className="h-6 w-6 text-desert-dark" />
            </div>
          </div>
          
          {/* Offline mode indicator */}
          {isOfflineMode && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md z-30 flex items-center">
              <MapPinOff className="h-4 w-4 text-desert-dark mr-1" />
              <span className="text-xs font-medium">Offline Mode</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Map;
