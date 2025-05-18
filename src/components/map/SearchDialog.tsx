
import React, { useRef, useEffect } from 'react';
import { Command } from '@/components/ui/command';
import { 
  Dialog,
  DialogContent
} from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Search, MapPin } from 'lucide-react';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  locations: any[];
  isLoading: boolean;
  onSelectLocation: (location: any) => void;
}

const SearchDialog = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  locations,
  isLoading,
  onSelectLocation,
}: SearchDialogProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogTitle className="sr-only">Search Locations</DialogTitle>
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {isLoading ? (
              <div className="p-4 text-center text-sm">Loading locations...</div>
            ) : searchQuery.length > 0 && locations.length === 0 ? (
              <div className="p-4 text-center text-sm">No locations found</div>
            ) : (
              locations.slice(0, 10).map((location) => (
                <div
                  key={location.id}
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-muted cursor-pointer"
                  onClick={() => {
                    onSelectLocation(location);
                    onClose();
                  }}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {location.tour?.title || "Location"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {location.tour?.description?.substring(0, 60) || "No description"}...
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
