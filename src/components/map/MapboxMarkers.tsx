
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Tour } from '@/services/toursData';
import { MapLocation } from '@/types/map';
import { createMarkerElement, createUserLocationMarker, addMarkerStyles } from '@/utils/mapboxUtils';

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

  // Add map markers
  useEffect(() => {
    if (!map || !isMapLoaded || !points) return;
    
    // Check if points have actually changed to avoid unnecessary updates
    const pointsSignature = JSON.stringify(points.map(p => p.id));
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
      if (!map) return;
      
      const el = createMarkerElement(
        point.tour?.isPremium, 
        point.tour?.id === activeTourId
      );
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([point.lng, point.lat])
        .addTo(map);
        
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
          marker.setPopup(popup);
          popup.addTo(map);
          popupsRef.current.push(popup);
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
    });
    
  }, [points, isMapLoaded, onPinClick, activeTourId, map]);

  // Handle user location marker
  useEffect(() => {
    if (!map || !isMapLoaded || !showUserLocation) return;
    
    // Remove existing user marker
    if (userMarker.current) {
      userMarker.current.remove();
      userMarker.current = null;
    }
    
    // Create user location marker
    const el = createUserLocationMarker();
    
    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([location.lng, location.lat])
      .addTo(map);
    
  }, [location, isMapLoaded, showUserLocation, map]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markers.current.forEach(marker => marker.remove());
      popupsRef.current.forEach(popup => popup.remove());
      if (userMarker.current) userMarker.current.remove();
    };
  }, []);

  return null; // This component doesn't render anything visually
};

export default MapboxMarkers;
