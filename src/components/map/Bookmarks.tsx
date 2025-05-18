
import React from 'react';
import { cn } from '@/lib/utils';
import { Bookmark as BookmarkIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Bookmark {
  id: string;
  name: string;
  notes?: string;
  lat: number;
  lng: number;
  createdAt: Date;
}

interface BookmarksProps {
  bookmarks: Bookmark[];
  onSelectBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (id: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const Bookmarks: React.FC<BookmarksProps> = ({ 
  bookmarks, 
  onSelectBookmark, 
  onDeleteBookmark, 
  onClose,
  isOpen
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute inset-0 bg-white z-40 p-4 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-lg font-medium">Your Bookmarks</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
      </div>
      
      {bookmarks.length === 0 ? (
        <div className="text-center p-8">
          <BookmarkIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
          <p className="text-muted-foreground">No bookmarks yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Long-press anywhere on the map to create a bookmark
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map(bookmark => (
            <div 
              key={bookmark.id} 
              className="border rounded-lg p-3 cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => onSelectBookmark(bookmark)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <BookmarkIcon className="h-5 w-5 text-desert mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">{bookmark.name}</h3>
                    {bookmark.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{bookmark.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="p-1 h-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBookmark(bookmark.id);
                  }}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
