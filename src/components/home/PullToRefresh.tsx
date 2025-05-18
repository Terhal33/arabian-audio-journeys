
import React, { useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCcw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  children: React.ReactNode;
}

const PullToRefresh = ({ onRefresh, isRefreshing, children }: PullToRefreshProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const [refreshingY, setRefreshingY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current !== null && scrollRef.current && scrollRef.current.scrollTop === 0) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      
      if (diff > 0) {
        // Prevent default to stop page pull-down behavior
        e.preventDefault();
        
        // Calculate pull distance with resistance
        const pullDistance = Math.min(diff * 0.4, 80);
        setRefreshingY(pullDistance);
        
        if (pullDistance > 60) {
          setRefreshing(true);
        } else {
          setRefreshing(false);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (refreshing && !isRefreshing) {
      // Trigger actual refresh
      onRefresh();
    }
    
    // Reset values
    startY.current = null;
    setRefreshingY(0);
    setRefreshing(false);
  };

  return (
    <div 
      className="relative" 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {refreshingY > 0 && (
        <div 
          className="absolute top-0 left-0 w-full flex justify-center z-10 pointer-events-none"
          style={{ transform: `translateY(${refreshingY - 40}px)` }}
        >
          <div className="bg-white rounded-full p-2 shadow-md">
            <RefreshCcw 
              className={`h-6 w-6 text-desert ${isRefreshing ? 'animate-spin' : refreshing ? 'text-desert-dark' : 'text-muted-foreground'}`} 
              style={{ 
                transform: `rotate(${refreshingY * 4}deg)` 
              }}
            />
          </div>
        </div>
      )}
      
      <ScrollArea 
        className="h-[calc(100vh-4rem)]" 
        ref={scrollRef} 
        data-testid="pull-to-refresh"
      >
        {children}
      </ScrollArea>
    </div>
  );
};

export default PullToRefresh;
