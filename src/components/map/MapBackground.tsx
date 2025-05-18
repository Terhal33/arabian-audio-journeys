
import React from 'react';

const MapBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-sand-light z-0">
      {/* Simulated terrain patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="sand-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M0 50 Q25 0 50 50 Q75 100 100 50" stroke="#8A650B" strokeWidth="0.5" fill="none" />
            <path d="M0 25 Q25 75 50 25 Q75 -25 100 25" stroke="#8A650B" strokeWidth="0.5" fill="none" />
            <path d="M0 75 Q25 25 50 75 Q75 125 100 75" stroke="#8A650B" strokeWidth="0.5" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#sand-pattern)" />
        </svg>
      </div>
      
      {/* Grid lines for map appearance */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
        {Array.from({ length: 64 }).map((_, i) => (
          <div 
            key={i} 
            className="border border-oasis-light border-opacity-20"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MapBackground;
