
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const useMobileFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    setPlatform(Capacitor.getPlatform() as 'ios' | 'android' | 'web');
  }, []);

  const preventZoom = () => {
    // Prevent zoom on double tap for mobile
    let lastTouchEnd = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      document.removeEventListener('touchend', handleTouchEnd);
    };
  };

  return {
    isNative,
    platform,
    preventZoom
  };
};
