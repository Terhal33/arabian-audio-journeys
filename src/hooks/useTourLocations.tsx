
import { useState, useEffect } from 'react';
import { tours } from '@/services/toursData';

export interface TourLocation {
  id: string;
  lat: number;
  lng: number;
  type: 'historic' | 'cultural' | 'religious' | 'nature' | 'modern' | 'user';
  isPremium: boolean;
  tour: typeof tours[0];
}

export const useTourLocations = (regionFilter: string = 'all', searchQuery: string = '') => {
  const [locations, setLocations] = useState<TourLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Fetching tour locations with:", { regionFilter, searchQuery });
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
            // For demo, we'll use arbitrary mapping:
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
            
            // If no explicit mapping, show all tours (better user experience)
            if (!regionMapping[regionFilter]) return true;
            
            return regionMapping[regionFilter]?.includes(tour.id) ?? false;
          })
          // Filter by search query if provided
          .filter(tour => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase().trim();
            
            if (query === '') return true;
            
            return (
              tour.title.toLowerCase().includes(query) ||
              tour.description.toLowerCase().includes(query) || 
              tour.points.some(point => 
                point.title.toLowerCase().includes(query) || 
                point.description.toLowerCase().includes(query)
              )
            );
          })
          .map(tour => {
            // Map tours to location objects with proper type casting
            return {
              id: tour.id,
              lat: tour.location.lat,
              lng: tour.location.lng,
              // Determine type based on id with proper type assertion
              type: tour.id.includes('historical') 
                ? 'historic' 
                : tour.id.includes('ula') 
                  ? 'cultural' 
                  : 'modern' as 'historic' | 'cultural' | 'religious' | 'nature' | 'modern' | 'user',
              isPremium: tour.isPremium,
              tour: tour
            } as TourLocation;
          });
        
        // Add tour points as additional locations
        const tourPointLocations = tours
          .filter(tour => {
            // Apply the same filters to tour points
            if (regionFilter !== 'all') {
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
              
              if (regionMapping[regionFilter] && !regionMapping[regionFilter].includes(tour.id)) {
                return false;
              }
            }
            
            if (searchQuery) {
              const query = searchQuery.toLowerCase().trim();
              if (query !== '' && !tour.title.toLowerCase().includes(query) && 
                  !tour.description.toLowerCase().includes(query) &&
                  !tour.points.some(point => 
                    point.title.toLowerCase().includes(query) || 
                    point.description.toLowerCase().includes(query)
                  )) {
                return false;
              }
            }
            
            return true;
          })
          .flatMap(tour => {
            return tour.points.map(point => ({
              id: point.id,
              lat: point.location.lat,
              lng: point.location.lng,
              type: 'historic' as const,
              isPremium: tour.isPremium,
              tour: tour
            }));
          });
        
        const allLocations = [...processedLocations, ...tourPointLocations];
        console.log(`Loaded ${allLocations.length} locations (${processedLocations.length} tours + ${tourPointLocations.length} points)`);
        
        setLocations(allLocations);
        setIsLoading(false);
      }, 300); // Reduced delay for better user experience
      
      return () => clearTimeout(timer);
      
    } catch (err) {
      console.error("Error loading tour locations:", err);
      setError(err instanceof Error ? err : new Error('Failed to load locations'));
      setIsLoading(false);
    }
  }, [regionFilter, searchQuery]);

  return { locations, isLoading, error };
};
