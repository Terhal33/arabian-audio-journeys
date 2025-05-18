
import mapboxgl from 'mapbox-gl';
import { calculateMapRadius } from './mapCalculations';

// Setup map event handlers
export const setupMapEventHandlers = (
  map: mapboxgl.Map, 
  mapContainer: React.RefObject<HTMLDivElement>, 
  onRegionChange?: (region: { lat: number, lng: number, radius: number }) => void
): void => {
  // When the map moves, notify about region change
  if (onRegionChange) {
    map.on('moveend', () => {
      const center = map.getCenter();
      const bounds = map.getBounds();
      
      // Calculate approximate radius in km based on viewport bounds
      const radius = calculateMapRadius(bounds);
      
      onRegionChange({
        lat: center.lat,
        lng: center.lng,
        radius: radius
      });
    });
  }
  
  // Handle long press/right click for bookmarks
  if (map.getContainer()) {
    map.on('contextmenu', (e) => {
      const longPressLocation = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng
      };
      
      // Dispatch custom event that can be caught by Map component
      const customEvent = new CustomEvent('maplongpress', { 
        detail: { location: longPressLocation }
      });
      mapContainer.current?.dispatchEvent(customEvent);
    });
  }
};
