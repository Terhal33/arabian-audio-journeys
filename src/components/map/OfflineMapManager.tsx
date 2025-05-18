
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Download, Trash2, Check, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface Region {
  id: string;
  name: string;
  size: string;
  isDownloaded: boolean;
}

interface OfflineMapManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const OfflineMapManager: React.FC<OfflineMapManagerProps> = ({ isOpen, onClose }) => {
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Example regions - in a real app, this would come from an API
  const [regions, setRegions] = useState<Region[]>([
    { id: 'riyadh', name: 'Riyadh Region', size: '120MB', isDownloaded: true },
    { id: 'makkah', name: 'Makkah Region', size: '180MB', isDownloaded: false },
    { id: 'madinah', name: 'Madinah Region', size: '90MB', isDownloaded: false },
    { id: 'eastern', name: 'Eastern Province', size: '150MB', isDownloaded: false },
    { id: 'tabuk', name: 'Tabuk Region', size: '75MB', isDownloaded: false },
  ]);
  
  const handleDownload = (regionId: string) => {
    if (!navigator.onLine) {
      toast({
        title: "No internet connection",
        description: "Connect to the internet to download maps for offline use",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate download progress
    setIsDownloading(true);
    setDownloadProgress(prev => ({ ...prev, [regionId]: 0 }));
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const newProgress = Math.min((prev[regionId] || 0) + 10, 100);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          
          // Mark region as downloaded
          setRegions(prev => 
            prev.map(r => r.id === regionId ? { ...r, isDownloaded: true } : r)
          );
          
          toast({
            title: "Download complete",
            description: `Map for ${regions.find(r => r.id === regionId)?.name} is now available offline`,
          });
          
          return prev;
        }
        
        return { ...prev, [regionId]: newProgress };
      });
    }, 500);
  };
  
  const handleDelete = (regionId: string) => {
    // Simulate deleting a downloaded region
    setRegions(prev => 
      prev.map(r => r.id === regionId ? { ...r, isDownloaded: false } : r)
    );
    
    toast({
      title: "Map deleted",
      description: `${regions.find(r => r.id === regionId)?.name} removed from offline storage`,
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="absolute inset-0 bg-white z-40 p-4 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-lg font-medium">Offline Maps</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
      </div>
      
      <div className="mb-6 bg-muted/30 p-3 rounded-lg flex items-center">
        {navigator.onLine ? (
          <>
            <Wifi className="h-5 w-5 text-desert mr-2" />
            <div>
              <p className="text-sm font-medium">Online</p>
              <p className="text-xs text-muted-foreground">You can download maps for offline use</p>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="h-5 w-5 text-destructive mr-2" />
            <div>
              <p className="text-sm font-medium">Offline</p>
              <p className="text-xs text-destructive">Connect to download maps</p>
            </div>
          </>
        )}
      </div>
      
      <div className="space-y-4">
        {regions.map(region => (
          <div key={region.id} className="border rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-sm">{region.name}</h3>
                <p className="text-xs text-muted-foreground">{region.size}</p>
              </div>
              
              {region.isDownloaded ? (
                <div className="flex items-center">
                  <span className="text-xs text-green-600 flex items-center mr-2">
                    <Check className="h-4 w-4 mr-1" /> Downloaded
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(region.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              ) : downloadProgress[region.id] !== undefined ? (
                <div className="w-40">
                  <Progress value={downloadProgress[region.id]} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {downloadProgress[region.id]}% downloaded
                  </p>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownload(region.id)}
                  disabled={isDownloading || !navigator.onLine}
                >
                  <Download className="h-3 w-3 mr-1" /> Download
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfflineMapManager;
