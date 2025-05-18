
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface OfflineAlertProps {
  isOffline: boolean;
}

const OfflineAlert = ({ isOffline }: OfflineAlertProps) => {
  if (!isOffline) return null;
  
  return (
    <div className="bg-destructive text-destructive-foreground p-2 text-center text-sm">
      <AlertTriangle className="inline h-4 w-4 mr-1" />
      You're offline. Showing cached content.
    </div>
  );
};

export default OfflineAlert;
