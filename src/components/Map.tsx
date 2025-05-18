
import React, { useEffect, useState } from 'react';
import { Tour } from '@/services/toursData';
import { MapLocation } from '@/types/map';
import MapCore from './map/MapCore';
import MapboxMap from './map/MapboxMap';
import MapboxTokenInput from './map/MapboxTokenInput';

interface MapProps {
  location: MapLocation;
  points?: any[];
  zoom?: number;
  interactive?: boolean;
  className?: string;
  onPinClick?: (location: MapLocation, tour?: Tour) => void;
  onRegionChange?: (region: { lat: number, lng: number, radius: number }) => void;
  showUserLocation?: boolean;
}

const Map = (props: MapProps) => {
  const [mapboxToken, setMapboxToken] = useState<string | undefined>();
  const [useMapbox, setUseMapbox] = useState<boolean>(false);

  useEffect(() => {
    console.log("Map component rendering with props:", {
      location: props.location,
      pointsCount: props.points?.length,
      interactive: props.interactive,
      showUserLocation: props.showUserLocation,
      useMapbox: useMapbox
    });
  }, [props.location, props.points, props.interactive, props.showUserLocation, useMapbox]);
  
  // Use Mapbox if token is available
  useEffect(() => {
    if (mapboxToken) {
      setUseMapbox(true);
    }
  }, [mapboxToken]);

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
  };

  return (
    <>
      {useMapbox ? (
        <MapboxMap {...props} mapboxToken={mapboxToken} />
      ) : (
        <>
          <MapCore {...props} />
          <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />
        </>
      )}
    </>
  );
};

export default Map;
