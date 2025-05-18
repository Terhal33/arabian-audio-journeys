
import React from 'react';
import { cn } from '@/lib/utils';

const Splash = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-sand-light">
      <div className="animate-pulse">
        <div className="text-5xl font-display font-bold text-center text-desert-dark">
          Arabian<span className="text-gold">Audio</span>
        </div>
        <div className="text-xl text-center text-muted-foreground mt-2">
          Your journey through Saudi Arabia's history
        </div>
      </div>
      
      <div className="absolute bottom-12 flex space-x-2 items-center">
        <div className={cn("audio-bar h-8")}></div>
        <div className={cn("audio-bar h-12")}></div>
        <div className={cn("audio-bar h-10")}></div>
        <div className={cn("audio-bar h-16")}></div>
        <div className={cn("audio-bar h-10")}></div>
        <div className={cn("audio-bar h-8")}></div>
      </div>
    </div>
  );
};

export default Splash;
