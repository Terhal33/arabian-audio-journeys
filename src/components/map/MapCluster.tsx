
import React from 'react';

interface MapClusterProps {
  cluster: {
    center: { lat: number; lng: number };
    count: number;
  };
  mapCenter: { lat: number; lng: number };
  zoom: number;
  onClick: (center: { lat: number; lng: number }) => void;
}

const MapCluster: React.FC<MapClusterProps> = ({ cluster, mapCenter, zoom, onClick }) => {
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
      style={{
        left: `${50 + (cluster.center.lng - mapCenter.lng) * zoom * 200}%`,
        top: `${50 - (cluster.center.lat - mapCenter.lat) * zoom * 200}%`
      }}
      onClick={() => onClick(cluster.center)}
    >
      <div className="bg-desert rounded-full shadow-lg flex items-center justify-center h-8 w-8 text-white text-xs font-medium border border-white">
        {cluster.count}
      </div>
    </div>
  );
};

export default MapCluster;
