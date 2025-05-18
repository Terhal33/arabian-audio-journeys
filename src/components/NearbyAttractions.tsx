
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Tour } from '@/services/toursData';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface NearbyAttractionsProps {
  tours: Tour[];
  userLocation?: { lat: number; lng: number };
  isLoading?: boolean;
  className?: string;
}

const NearbyAttractions = ({ 
  tours, 
  userLocation,
  isLoading = false,
  className 
}: NearbyAttractionsProps) => {
  // Helper function to calculate distance (simplified version)
  const calculateDistance = (tourLocation: { lat: number; lng: number }) => {
    if (!userLocation) return null;
    
    // Simple distance calculation (not accurate for real-world use)
    const distance = Math.sqrt(
      Math.pow(tourLocation.lat - userLocation.lat, 2) +
      Math.pow(tourLocation.lng - userLocation.lng, 2)
    ) * 111; // rough conversion to km
    
    return distance.toFixed(1);
  };

  // Create skeleton placeholders for loading state
  const skeletonItems = Array(3).fill(0).map((_, i) => (
    <div key={`skeleton-${i}`} className="min-w-[250px] mr-4">
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  ));

  // Sort tours by distance if user location is available
  const sortedTours = userLocation ? 
    [...tours].sort((a, b) => {
      const distA = parseFloat(calculateDistance(a.location) || '1000');
      const distB = parseFloat(calculateDistance(b.location) || '1000');
      return distA - distB;
    }) : 
    tours;

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold text-desert-dark">Nearby Attractions</h2>
        {userLocation && (
          <Badge variant="outline" className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" /> 
            Current Location
          </Badge>
        )}
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex pb-4 px-1">
          {isLoading ? (
            skeletonItems
          ) : sortedTours.length > 0 ? (
            sortedTours.map((tour) => {
              const distance = calculateDistance(tour.location);
              
              return (
                <Link 
                  to={`/tour/${tour.id}`} 
                  key={tour.id}
                  className="min-w-[250px] mr-4 animate-fade-in"
                >
                  <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                    <div className="relative h-32">
                      <img 
                        src={tour.imageUrl} 
                        alt={tour.title} 
                        className="h-full w-full object-cover" 
                      />
                      {distance && (
                        <Badge className="absolute bottom-2 right-2 bg-background/80 text-foreground backdrop-blur-sm">
                          <Navigation className="h-3 w-3 mr-1" /> {distance} km
                        </Badge>
                      )}
                      {tour.isPremium && (
                        <Badge className="absolute top-2 right-2 bg-gold hover:bg-gold-dark">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm line-clamp-1">{tour.title}</h3>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="line-clamp-1">Located in {tour.id.replace('-', ' ')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="text-center w-full py-10">
              <p className="text-muted-foreground">No nearby attractions found</p>
              {!userLocation && (
                <p className="text-xs text-muted-foreground mt-2">Enable location services to see attractions near you</p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NearbyAttractions;
