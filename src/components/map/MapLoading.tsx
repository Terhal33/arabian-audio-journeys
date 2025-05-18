
import React from 'react';

const MapLoading: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-pulse flex space-x-2 justify-center items-center">
        <div className="h-2 w-2 bg-oasis rounded-full"></div>
        <div className="h-2 w-2 bg-oasis rounded-full"></div>
        <div className="h-2 w-2 bg-oasis rounded-full"></div>
      </div>
    </div>
  );
};

export default MapLoading;
