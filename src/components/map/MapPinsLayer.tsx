
import React from 'react';
import { Bookmark } from './Bookmarks';
import MapPin from './MapPin';
import MapCluster from './MapCluster';
import { useMapClustering, MapPin as MapPinType } from './useMapClustering';

interface MapLocation {
  lat: number;
  lng: number;
}

interface MapPinsLayerProps {
  points: MapPinType[];
  bookmarks: Bookmark[];
  mapCenter: MapLocation;
  zoom: number;
  onPinClick: (point: MapPinType) => void;
  onClusterClick: (center: MapLocation) => void;
  onViewBookmark: (bookmark: Bookmark) => void;
  onLongPress: (point: MapPinType) => void;
}

const MapPinsLayer: React.FC<MapPinsLayerProps> = ({
  points,
  bookmarks,
  mapCenter,
  zoom,
  onPinClick,
  onClusterClick,
  onViewBookmark,
  onLongPress
}) => {
  const { clusters, filteredPoints } = useMapClustering(points);
  
  return (
    <>
      {/* Bookmarks */}
      {bookmarks.map(bookmark => (
        <MapPin
          key={`bookmark-${bookmark.id}`}
          point={{
            id: bookmark.id,
            lat: bookmark.lat,
            lng: bookmark.lng,
            type: 'user'
          }}
          mapCenter={mapCenter}
          zoom={zoom}
          onClick={() => onViewBookmark(bookmark)}
        />
      ))}
      
      {/* Regular pins */}
      {filteredPoints.map((point, index) => (
        <MapPin 
          key={point.id || index}
          point={point}
          mapCenter={mapCenter}
          zoom={zoom}
          onClick={onPinClick}
          onLongPress={onLongPress}
        />
      ))}
      
      {/* Cluster markers */}
      {clusters.map((cluster, index) => (
        <MapCluster
          key={`cluster-${index}`}
          cluster={cluster}
          mapCenter={mapCenter}
          zoom={zoom}
          onClick={onClusterClick}
        />
      ))}
    </>
  );
};

export default MapPinsLayer;
