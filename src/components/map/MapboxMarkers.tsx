
import { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Tour } from '@/services/toursData';
import { MapLocation } from '@/types/map';
import { createMarkerElement, createUserLocationMarker, addMarkerStyles } from '@/utils/mapbox';

interface MapboxMarkersProps {
  map: mapboxgl.Map | null;
  isMapLoaded: boolean;
  points?: any[];
  location: MapLocation;
  showUserLocation?: boolean;
  activeTourId: string | null;
  onPinClick?: (location: MapLocation, tour?: Tour) => void;
  setActiveTourId: (id: string | null) => void;
}

const MapboxMarkers: React.FC<MapboxMarkersProps> = ({
  map,
  isMapLoaded,
  points = [],
  location,
  showUserLocation,
  activeTourId,
  onPinClick,
  setActiveTourId
}) => {
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const lastPointsSignature = useRef<string>('');
  const cleanupTimeoutRef = useRef<number | null>(null);

  // Cleanup function to safely remove markers and popups
  const cleanup = useCallback(() => {
    // Clear any pending cleanup
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }

    // Remove markers
    markers.current.forEach(marker => {
      try {
        marker.remove();
      } catch (e) {
        console.warn("Error removing marker:", e);
      }
    });
    markers.current = [];
    
    // Remove popups
    popupsRef.current.forEach(popup => {
      try {
        popup.remove();
      } catch (e) {
        console.warn("Error removing popup:", e);
      }
    });
    popupsRef.current = [];
    
    // Remove user marker
    if (userMarker.current) {
      try {
        userMarker.current.remove();
        userMarker.current = null;
      } catch (e) {
        console.warn("Error removing user marker:", e);
      }
    }
  }, []);

  // Add map markers
  useEffect(() => {
    if (!map || !isMapLoaded || !points) return;
    
    // Ensure map is fully initialized with a container element
    if (!map.getContainer()) {
      console.warn('Map container not available yet');
      return;
    }
    
    // Check if points have actually changed to avoid unnecessary updates
    const pointsSignature = JSON.stringify(points.map(p => ({ id: p.id, lat: p.lat, lng: p.lng })));
    if (pointsSignature === lastPointsSignature.current) return;
    lastPointsSignature.current = pointsSignature;
    
    // Remove existing markers and popups
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    popupsRef.current.forEach(popup => popup.remove());
    popupsRef.current = [];
    
    // Add marker styles
    addMarkerStyles();
    
    // Add new markers for each point
    points.forEach(point => {
      if (!map || !map.getContainer()) return;
      
      try {
        const el = createMarkerElement(
          point.tour?.isPremium, 
          point.tour?.id === activeTourId
        );
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([point.lng, point.lat]);
        
        // Only try to add to map if it's valid
        if (map.getContainer()) {
          marker.addTo(map);
        }
          
        // Add popup with tour name
        if (point.tour) {
          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 25,
            className: 'mapbox-popup'
          }).setHTML(`
            <div class="p-2 bg-white rounded shadow-md">
              <h3 class="font-medium text-sm">${point.tour.title}</h3>
              ${point.tour.isPremium ? '<span class="text-xs text-amber-600">Premium</span>' : ''}
            </div>
          `);
          
          el.addEventListener('mouseenter', () => {
            if (map && map.getContainer()) {
              marker.setPopup(popup);
              popup.addTo(map);
              popupsRef.current.push(popup);
            }
          });
          
          el.addEventListener('mouseleave', () => {
            popup.remove();
            popupsRef.current = popupsRef.current.filter(p => p !== popup);
          });
        }
        
        // Add click handler if interactive
        if (onPinClick) {
          el.addEventListener('click', () => {
            onPinClick(point, point.tour);
            setActiveTourId(point.tour?.id || null);
          });
        }
        
        markers.current.push(marker);
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });
    
  }, [points, isMapLoaded, onPinClick, activeTourId, map, setActiveTourId]);

  // Handle user location marker
  useEffect(() => {
    if (!map || !isMapLoaded || !showUserLocation) return;
    
    // Ensure map is fully initialized with a container element
    if (!map.getContainer()) {
      console.warn('Map container not available for user location marker');
      return;
    }
    
    try {
      // Remove existing user marker
      if (userMarker.current) {
        userMarker.current.remove();
        userMarker.current = null;
      }
      
      // Create user location marker
      const el = createUserLocationMarker();
      
      userMarker.current = new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat]);
      
      // Only try to add to map if it's valid
      if (map.getContainer()) {
        userMarker.current.addTo(map);
      }
    } catch (error) {
      console.error("Error adding user location marker:", error);
    }
    
  }, [location, isMapLoaded, showUserLocation, map]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return null; // This component doesn't render anything visually
};

export default MapboxMarkers;
