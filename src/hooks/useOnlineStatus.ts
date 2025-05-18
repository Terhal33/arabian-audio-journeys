
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useOnlineStatus = () => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const handleOnlineStatus = useCallback(() => {
    const newStatus = navigator.onLine;
    setIsOnline(newStatus);
    
    if (newStatus && !isOnline) {
      // Just came back online
      toast({
        title: "You're back online",
        description: "Pull down to refresh content"
      });
    } else if (!newStatus) {
      toast({
        title: "You're offline",
        description: "Showing cached content",
        variant: "destructive"
      });
    }
  }, [isOnline, toast]);
  
  useEffect(() => {
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [handleOnlineStatus]);
  
  return isOnline;
};
