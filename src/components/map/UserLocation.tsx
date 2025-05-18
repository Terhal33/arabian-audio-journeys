
import React, { useState, useEffect } from 'react';

interface UserLocationProps {
  location: { lat: number; lng: number };
  showUserLocation: boolean;
}

const UserLocation: React.FC<UserLocationProps> = ({ location, showUserLocation }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const hasUserLocation = showUserLocation && location && location.lat && location.lng;
  
  // Toggle animation to create pulsing effect
  useEffect(() => {
    if (!hasUserLocation) return;
    
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [hasUserLocation]);

  if (!hasUserLocation) return null;
  
  return (
    <div 
      className="absolute z-20"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative">
        {/* Accuracy circle */}
        <div className={`absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-blue-500 bg-opacity-20 ${isAnimating ? 'animate-pulse' : ''}`}></div>
        
        {/* Inner pulse circle */}
        <div className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-400 bg-opacity-30 ${isAnimating ? 'animate-ping' : ''}`}></div>
        
        {/* Location dot */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2 bg-blue-500 h-4 w-4 rounded-full border-2 border-white shadow-lg"></div>
      </div>
    </div>
  );
};

export default UserLocation;
