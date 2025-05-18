
import mapboxgl from 'mapbox-gl';

// Calculate radius in km based on map bounds
export const calculateMapRadius = (bounds: mapboxgl.LngLatBounds): number => {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const radiusLat = Math.abs(ne.lat - sw.lat) / 2;
  const radiusLng = Math.abs(ne.lng - sw.lng) / 2;
  return Math.max(radiusLat, radiusLng) * 111; // Rough conversion to km
};
