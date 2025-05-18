
import React from 'react';
import { Compass, Plus, Minus } from 'lucide-react';

interface MapControlsProps {
  interactive: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  interactive,
  onZoomIn,
  onZoomOut
}) => {
  return (
    <>
      {/* Map controls (dummy) */}
      {interactive && (
        <div className="absolute right-4 top-4 flex flex-col space-y-2 z-20">
          <button 
            className="bg-white p-2 rounded-full shadow-md text-muted-foreground hover:text-foreground transition"
            onClick={onZoomIn}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button 
            className="bg-white p-2 rounded-full shadow-md text-muted-foreground hover:text-foreground transition"
            onClick={onZoomOut}
          >
            <Minus className="h-4 w-4" />
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
