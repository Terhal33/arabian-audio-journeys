
import React from 'react';
import { Compass, Plus, Minus, BookmarkPlus } from 'lucide-react';

interface MapControlsProps {
  interactive: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onAddBookmark?: () => void;
  showBookmarkButton?: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  interactive,
  onZoomIn,
  onZoomOut,
  onAddBookmark,
  showBookmarkButton = false
}) => {
  return (
    <>
      {/* Map controls */}
      {interactive && (
        <div className="absolute right-4 top-4 flex flex-col space-y-2 z-20">
          <button 
            className="bg-white p-2 rounded-full shadow-md text-muted-foreground hover:text-foreground transition"
            onClick={onZoomIn}
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button 
            className="bg-white p-2 rounded-full shadow-md text-muted-foreground hover:text-foreground transition"
            onClick={onZoomOut}
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          {showBookmarkButton && (
            <button 
              className="bg-white p-2 rounded-full shadow-md text-muted-foreground hover:text-foreground transition"
              onClick={onAddBookmark}
              aria-label="Add bookmark"
            >
              <BookmarkPlus className="h-4 w-4" />
            </button>
          )}
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
