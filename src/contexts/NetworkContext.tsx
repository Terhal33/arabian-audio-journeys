
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NetworkContextType {
  isOnline: boolean;
  connectionQuality: 'unknown' | 'poor' | 'good' | 'excellent';
  isBackgroundSyncEnabled: boolean;
  toggleBackgroundSync: () => void;
  prefetchResources: (urls: string[]) => void;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  connectionQuality: 'unknown',
  isBackgroundSyncEnabled: false,
  toggleBackgroundSync: () => {},
  prefetchResources: () => {},
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'unknown' | 'poor' | 'good' | 'excellent'>('unknown');
  const [isBackgroundSyncEnabled, setIsBackgroundSyncEnabled] = useState<boolean>(
    localStorage.getItem('background_sync_enabled') === 'true'
  );
  const { toast } = useToast();

  // Set up network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online",
        description: "You're connected to the internet again",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Some features may not be available",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection quality if available
    if ('connection' in navigator && navigator.connection) {
      // @ts-ignore - some browsers support the connection API
      const connection = navigator.connection;
      
      const updateConnectionQuality = () => {
        // @ts-ignore
        const effectiveType = connection.effectiveType || 'unknown';
        
        if (effectiveType === '4g') {
          setConnectionQuality('excellent');
        } else if (effectiveType === '3g') {
          setConnectionQuality('good');
        } else {
          setConnectionQuality('poor');
        }
      };
      
      updateConnectionQuality();
      
      // @ts-ignore
      if (connection.addEventListener) {
        // @ts-ignore
        connection.addEventListener('change', updateConnectionQuality);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // @ts-ignore
      if ('connection' in navigator && navigator.connection && navigator.connection.removeEventListener) {
        // @ts-ignore
        navigator.connection.removeEventListener('change', updateConnectionQuality);
      }
    };
  }, [toast]);

  // Toggle background sync
  const toggleBackgroundSync = () => {
    const newValue = !isBackgroundSyncEnabled;
    setIsBackgroundSyncEnabled(newValue);
    localStorage.setItem('background_sync_enabled', String(newValue));
    
    toast({
      title: newValue ? "Background sync enabled" : "Background sync disabled",
      description: newValue 
        ? "Content will be updated automatically" 
        : "Content will only update when you refresh",
    });
  };

  // Prefetch resources for better performance
  const prefetchResources = (urls: string[]) => {
    if (!isOnline) return;
    
    urls.forEach(url => {
      if (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.webp')) {
        const img = new Image();
        img.src = url;
      } else if (url.endsWith('.mp3') || url.endsWith('.wav')) {
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.src = url;
      } else {
        fetch(url, { method: 'HEAD' }).catch(() => {});
      }
    });
  };

  const value = {
    isOnline,
    connectionQuality,
    isBackgroundSyncEnabled,
    toggleBackgroundSync,
    prefetchResources,
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};
