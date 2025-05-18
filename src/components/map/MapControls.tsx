
import React from 'react';
import { Compass } from 'lucide-react';

interface MapControlsProps {
  interactive: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({ interactive }) => {
  return (
    <>
      {/* Map controls (dummy) */}
      {interactive && (
        <div className="absolute right-4 top-4 flex flex-col space-y-2 z-20">
          <button className="bg-white p-2 rounded-full shadow-md text-muted-foreground hover:text-foreground transition">
            <span className="text-xl">+</span>
          </button>
          <button className="bg-white p-2 rounded-full shadow-md text-muted-foreground hover:text-foreground transition">
            <span className="text-xl">−</span>
          </button>
        </div>
      )}
      
      {/* Compass rose */}
      <div className="absolute left-4 bottom-4 z-20">
        <div className="bg-white bg-opacity-80 backdrop-blur-sm p-2 rounded-full shadow-md">
          <Compass className="h-6 w-6 text-desert-dark" />
        </div>
      </div>
    </>
  );
};

export default MapControls;
