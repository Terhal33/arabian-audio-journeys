
import { useState, useEffect } from 'react';

interface GeolocationState {
  location: { lat: number, lng: number } | null;
  locationName: string;
  isLoading: boolean;
  error: GeolocationPositionError | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    locationName: 'Saudi Arabia',
    isLoading: true,
    error: null
  });
  
  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: new GeolocationPositionError(),
        isLoading: false
      }));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          locationName: 'Riyadh, Saudi Arabia', // In a real app, we'd use reverse geocoding
          isLoading: false,
          error: null
        });
      },
      (error) => {
        console.log('Geolocation error:', error);
        setState({
          location: {
            lat: 24.7136, // Default to Riyadh coordinates
            lng: 46.6753
          },
          locationName: 'Saudi Arabia',
          isLoading: false,
          error
        });
      }
    );
  }, []);
  
  return state;
};
