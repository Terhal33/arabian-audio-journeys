
import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useOnlineStatus = () => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const toastShownRef = useRef<boolean>(false);
  
  // Reset toast shown state when online status changes
  useEffect(() => {
    toastShownRef.current = false;
  }, [isOnline]);
  
  const handleOnlineStatus = useCallback(() => {
    const newStatus = navigator.onLine;
    
    // Only update if status changed
    if (newStatus !== isOnline) {
      setIsOnline(newStatus);
      
      if (newStatus) {
        // Just came back online - only show if we haven't already
        if (!toastShownRef.current) {
          toast({
            title: "You're back online",
            description: "Pull down to refresh content"
          });
          toastShownRef.current = true;
        }
      } else {
        // Just went offline
        toast({
          title: "You're offline",
          description: "Showing cached content",
          variant: "destructive"
        });
      }
    }
  }, [isOnline, toast]);
  
  // Network ping to verify actual connectivity
  useEffect(() => {
    const checkNetworkConnection = async () => {
      try {
        // Send a tiny HEAD request to verify actual internet connectivity
        // Use a timestamp to prevent caching
        const res = await fetch(`/api/ping?_=${Date.now()}`, { 
          method: 'HEAD',
          // Set a short timeout to avoid hanging
          signal: AbortSignal.timeout(3000)
        });
        
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        
        if (!isOnline) {
          setIsOnline(true);
          toast({
            title: "You're back online",
            description: "Pull down to refresh content"
          });
        }
      } catch (error) {
        // If we're supposedly online but request fails, we're actually offline
        if (isOnline) {
          setIsOnline(false);
          toast({
            title: "You're offline",
            description: "Showing cached content",
            variant: "destructive"
          });
        }
      }
    };
    
    // Check initial status
    if (navigator.onLine) {
      checkNetworkConnection();
    }
    
    // Set up event listeners
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Set up periodic checks while the component is mounted
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        // Only do active checks if the browser thinks we're online
        checkNetworkConnection();
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      clearInterval(intervalId);
    };
  }, [handleOnlineStatus, isOnline, toast]);
  
  return isOnline;
};
