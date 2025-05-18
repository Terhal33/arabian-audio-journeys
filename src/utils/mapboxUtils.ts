
import mapboxgl from 'mapbox-gl';
import { Tour } from '@/services/toursData';
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

// Calculate radius in km based on map bounds
export const calculateMapRadius = (bounds: mapboxgl.LngLatBounds): number => {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const radiusLat = Math.abs(ne.lat - sw.lat) / 2;
  const radiusLng = Math.abs(ne.lng - sw.lng) / 2;
  return Math.max(radiusLat, radiusLng) * 111; // Rough conversion to km
};

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

// Create a marker element
export const createMarkerElement = (isPremium?: boolean, isActive?: boolean): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'mapbox-marker';
  el.style.width = '25px';
  el.style.height = '25px';
  el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/pin.png)';
  el.style.backgroundSize = 'contain';
  el.style.backgroundRepeat = 'no-repeat';
  el.style.cursor = 'pointer';
  
  // If the point is premium, add a special style
  if (isPremium) {
    el.style.filter = 'hue-rotate(40deg) saturate(2)';
  }
  
  // Highlight active tour
  if (isActive) {
    el.style.filter = 'hue-rotate(180deg) brightness(1.2)';
    el.style.transform = 'scale(1.2)';
    el.style.zIndex = '10';
  }
  
  return el;
};

// Create a user location marker
export const createUserLocationMarker = (): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'user-marker';
  el.innerHTML = `
    <div style="position: relative;">
      <div style="position: absolute; transform: translate(-50%, -50%); width: 16px; height: 16px; background-color: white; border: 3px solid #3b82f6; border-radius: 50%; box-shadow: 0 0 0 2px white;"></div>
      <div style="position: absolute; transform: translate(-50%, -50%); width: 32px; height: 32px; background-color: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
    </div>
  `;
  
  return el;
};

// Add CSS for map markers
export const addMarkerStyles = (): void => {
  if (!document.getElementById('mapbox-marker-styles')) {
    const style = document.createElement('style');
    style.id = 'mapbox-marker-styles';
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
      
      .mapbox-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);
  }
};

// Create and add tour paths to the map
export const updateTourPaths = (
  map: mapboxgl.Map | null,
  points: any[] = [],
  activeTourId: string | null
): void => {
  if (!map || !map.isStyleLoaded() || points.length === 0) return;
  
  try {
    // Find active tour
    const activeTour = points.find(p => p.tour?.id === activeTourId)?.tour;
    
    if (!activeTour || !activeTour.points || activeTour.points.length === 0) {
      // Clear routes if no active tour or no points
      const source = map.getSource('routes') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: []
        });
      }
      return;
    }
    
    // Create path coordinates
    const coordinates = [
      [activeTour.location.lng, activeTour.location.lat],
      ...activeTour.points.map(point => [point.location.lng, point.location.lat])
    ];
    
    // Update the route data
    const source = map.getSource('routes') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates
            }
          }
        ]
      });
    }
  } catch (error) {
    console.error("Error updating tour paths:", error);
  }
};
