
import { useState, useEffect, useMemo } from 'react';
import { tours } from '@/services/toursData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface TourLocation {
  id: string;
  lat: number;
  lng: number;
  type: 'historic' | 'cultural' | 'religious' | 'nature' | 'modern' | 'user';
  isPremium: boolean;
  tour: typeof tours[0];
}

interface TourLocationsCache {
  timestamp: number;
  locations: TourLocation[];
}

// Cache expiration time (1 hour)
const CACHE_EXPIRATION = 60 * 60 * 1000;

export const useTourLocations = (regionFilter: string = 'all', searchQuery: string = '', viewportBounds?: {
  north: number;
  south: number;
  east: number;
  west: number;
}) => {
  const [allLocations, setAllLocations] = useState<TourLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cachedLocations, setCachedLocations] = useLocalStorage<TourLocationsCache>('tour_locations_cache', {
    timestamp: 0,
    locations: []
  });

  // Process the raw tour data into locations
  useEffect(() => {
    console.log("Fetching tour locations with:", { regionFilter, searchQuery });
    setIsLoading(true);
    
    try {
      // Check if we have valid cached data
      if (cachedLocations.locations.length > 0 && 
          (Date.now() - cachedLocations.timestamp < CACHE_EXPIRATION)) {
        console.log("Using cached locations data");
        setAllLocations(cachedLocations.locations);
        setIsLoading(false);
        return;
      }
      
      // Simulate API call delay
      const timer = setTimeout(() => {
        // Process tours into locations
        const processedLocations = tours
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
        
        const allProcessedLocations = [...processedLocations, ...tourPointLocations];
        console.log(`Loaded ${allProcessedLocations.length} locations (${processedLocations.length} tours + ${tourPointLocations.length} points)`);
        
        // Cache the locations
        setCachedLocations({
          timestamp: Date.now(),
          locations: allProcessedLocations
        });
        
        setAllLocations(allProcessedLocations);
        setIsLoading(false);
      }, 300); // Reduced delay for better user experience
      
      return () => clearTimeout(timer);
      
    } catch (err) {
      console.error("Error loading tour locations:", err);
      setError(err instanceof Error ? err : new Error('Failed to load locations'));
      setIsLoading(false);
    }
  }, []); // Only load the full dataset once

  // Filter locations based on search query, region filter, and viewport bounds
  const locations = useMemo(() => {
    if (allLocations.length === 0) return [];
    
    return allLocations.filter(location => {
      // Apply region filter
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
        
        if (regionMapping[regionFilter] && 
            !regionMapping[regionFilter].includes(location.tour.id)) {
          return false;
        }
      }
      
      // Apply search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        if (query !== '') {
          const tour = location.tour;
          const matchesTitle = tour.title.toLowerCase().includes(query);
          const matchesDescription = tour.description.toLowerCase().includes(query);
          const matchesPointTitle = tour.points.some(p => p.title.toLowerCase().includes(query));
          const matchesPointDesc = tour.points.some(p => p.description.toLowerCase().includes(query));
          
          if (!matchesTitle && !matchesDescription && !matchesPointTitle && !matchesPointDesc) {
            return false;
          }
        }
      }
      
      // Apply viewport bounds (if provided)
      if (viewportBounds) {
        // Check if location is within current viewport bounds
        if (location.lat > viewportBounds.north || 
            location.lat < viewportBounds.south || 
            location.lng > viewportBounds.east || 
            location.lng < viewportBounds.west) {
          return false;
        }
      }
      
      return true;
    });
  }, [allLocations, regionFilter, searchQuery, viewportBounds]);

  return { locations, allLocations, isLoading, error };
};
