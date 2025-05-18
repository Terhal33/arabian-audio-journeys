
import mapboxgl from 'mapbox-gl';
import { MapLocation } from '@/types/map';

// Create and configure a new Mapbox map instance
export const initializeMap = (
  container: HTMLDivElement,
  mapboxToken: string,
  location: MapLocation,
  zoom: number,
  interactive: boolean
): mapboxgl.Map => {
  mapboxgl.accessToken = mapboxToken;
  
  const map = new mapboxgl.Map({
    container: container,
    style: 'mapbox://styles/mapbox/outdoors-v12', // Using a style that shows terrain better
    center: [location.lng, location.lat],
    zoom: zoom,
    interactive: interactive,
    attributionControl: false
  });

  return map;
};

// Add map controls based on map configuration
export const addMapControls = (
  map: mapboxgl.Map, 
  interactive: boolean, 
  showUserLocation: boolean
): void => {
  if (interactive) {
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    
    if (showUserLocation) {
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      });
      map.addControl(geolocateControl, 'top-right');
    }
  }
};
