
import React, { useEffect, useState } from 'react';
import { Tour } from '@/services/toursData';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeofenceAlertProps {
  userLocation: { lat: number; lng: number } | null;
  points: Array<{ lat: number; lng: number; tour?: Tour }>;
  onViewDetails: (tour: Tour) => void;
}

const GeofenceAlert: React.FC<GeofenceAlertProps> = ({ 
  userLocation, 
  points, 
  onViewDetails 
}) => {
  const [nearbyPoint, setNearbyPoint] = useState<(typeof points)[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (!userLocation) return;
    
    // Check if user is near any point (within ~300 meters)
    // 0.003 degrees is approximately 300 meters
    const threshold = 0.003;
    
    const nearby = points.find(point => {
      if (!point.tour) return false;
      
      const distance = Math.sqrt(
        Math.pow(userLocation.lat - point.lat, 2) + 
        Math.pow(userLocation.lng - point.lng, 2)
      );
      
      return distance < threshold;
    });
    
    if (nearby && nearby !== nearbyPoint) {
      setNearbyPoint(nearby);
      setIsVisible(true);
      
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [userLocation, points, nearbyPoint]);
  
  if (!isVisible || !nearbyPoint || !nearbyPoint.tour) {
    return null;
  }
  
  return (
    <div className={cn(
      "fixed top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-30",
      "w-11/12 max-w-md transition-all duration-300 animate-in slide-in-from-top",
      "border border-desert/20"
    )}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-2 right-2 p-1 h-auto"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex items-start">
        <div className="bg-desert/20 p-2 rounded-full mr-3">
          <MapPin className="h-5 w-5 text-desert" />
        </div>
        
        <div>
          <h3 className="font-medium text-sm">
            Nearby: {nearbyPoint.tour.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {nearbyPoint.tour.description}
          </p>
          
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              onViewDetails(nearbyPoint.tour!);
              setIsVisible(false);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeofenceAlert;
