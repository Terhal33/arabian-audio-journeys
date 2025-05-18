
import mapboxgl from 'mapbox-gl';
import { MapRegion } from '@/types/map';

// Set up event handlers for Mapbox maps
export const setupMapEventHandlers = (
  map: mapboxgl.Map,
  mapContainer: React.RefObject<HTMLDivElement>,
  onRegionChange?: (region: MapRegion) => void
): void => {
  if (!map) return;

  // Add move end event to track map region changes
  map.on('moveend', () => {
    if (onRegionChange) {
      const center = map.getCenter();
      // Calculate visible radius in kilometers based on zoom level
      const zoom = map.getZoom();
      // Approximate radius calculation - lower zoom = larger radius
      const radius = Math.max(1, 100 * Math.pow(0.5, zoom - 3));
      
      onRegionChange({
        lat: center.lat,
        lng: center.lng,
        radius
      });
    }
  });
  
  // Long press detection
  let pressTimer: number | null = null;
  let startPoint: { x: number, y: number } | null = null;
  
  // Mouse events for desktop
  map.on('mousedown', (e) => {
    startPoint = { x: e.point.x, y: e.point.y };
    pressTimer = window.setTimeout(() => {
      handleLongPress(e, mapContainer);
    }, 800); // Long press threshold
  });
  
  map.on('mouseup', () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    startPoint = null;
  });
  
  map.on('mousemove', (e) => {
    if (pressTimer && startPoint) {
      // Cancel if moved too far
      const dx = e.point.x - startPoint.x;
      const dy = e.point.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) { // Movement tolerance
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    }
  });
  
  // Touch events for mobile
  if (mapContainer.current) {
    mapContainer.current.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return; // Ignore multi-touch
      
      const touch = e.touches[0];
      startPoint = { x: touch.clientX, y: touch.clientY };
      
      pressTimer = window.setTimeout(() => {
        const fakeEvent = {
          lngLat: map.unproject([touch.clientX, touch.clientY])
        };
        handleLongPress(fakeEvent as mapboxgl.MapMouseEvent, mapContainer);
      }, 800);
    }, { passive: false });
    
    mapContainer.current.addEventListener('touchend', () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
      startPoint = null;
    });
    
    mapContainer.current.addEventListener('touchmove', (e) => {
      if (pressTimer && startPoint && e.touches.length === 1) {
        const touch = e.touches[0];
        const dx = touch.clientX - startPoint.x;
        const dy = touch.clientY - startPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 10) { // Movement tolerance for touch
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      }
    }, { passive: false });
  }
};

// Handle long press events
const handleLongPress = (
  e: mapboxgl.MapMouseEvent, 
  mapContainer: React.RefObject<HTMLDivElement>
) => {
  if (!mapContainer.current) return;
  
  const location = {
    lat: e.lngLat.lat,
    lng: e.lngLat.lng
  };
  
  // Create and dispatch a custom event for the long press
  const event = new CustomEvent('maplongpress', {
    detail: { location }
  });
  
  mapContainer.current.dispatchEvent(event);
  
  console.log('Map long press detected at:', location);
};
