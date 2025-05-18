
import { useState, useEffect } from 'react';
import { tours } from '@/services/toursData';

export interface TourLocation {
  id: string;
  lat: number;
  lng: number;
  type?: 'historic' | 'cultural' | 'religious' | 'nature' | 'modern' | 'user';
  isPremium: boolean;
  tour: typeof tours[0];
}

export const useTourLocations = (regionFilter: string = 'all', searchQuery: string = '') => {
  const [locations, setLocations] = useState<TourLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      const timer = setTimeout(() => {
        // Process tours into locations
        const processedLocations = tours
          // Filter by region if needed
          .filter(tour => {
            if (regionFilter === 'all') return true;
            
            // This is a simplification. In a real app, each tour would have a region property
            // For demo, we'll use arbitrary matching:
            const regionMapping: Record<string, string[]> = {
              'riyadh': ['diriyah-main'],
              'makkah': ['jeddah-historical'],
              'madinah': [],
              'qassim': [],
              'eastern': [],
              'asir': [],
              'tabuk': ['al-ula'],
              'hail': [],
            };
            
            return regionMapping[regionFilter]?.includes(tour.id) ?? false;
          })
          // Filter by search query if provided
          .filter(tour => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            
            return (
              tour.title.toLowerCase().includes(query) ||
              tour.description.toLowerCase().includes(query)
            );
          })
          .map(tour => {
            // Map tours to location objects
            return {
              id: tour.id,
              lat: tour.location.lat,
              lng: tour.location.lng,
              // Determine type based on id (simplified)
              type: tour.id.includes('historical') 
                ? 'historic' 
                : tour.id.includes('ula') 
                  ? 'cultural' 
                  : 'modern',
              isPremium: tour.isPremium,
              tour: tour
            };
          });
        
        // Add tour points as additional locations
        const tourPointLocations = tours.flatMap(tour => {
          return tour.points.map(point => ({
            id: point.id,
            lat: point.location.lat,
            lng: point.location.lng,
            type: 'historic' as const,
            isPremium: tour.isPremium,
            tour: tour
          }));
        });
        
        setLocations([...processedLocations, ...tourPointLocations]);
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load locations'));
      setIsLoading(false);
    }
  }, [regionFilter, searchQuery]);

  return { locations, isLoading, error };
};
