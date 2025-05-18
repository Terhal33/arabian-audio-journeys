
import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Menu, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookmarkIcon, Download } from 'lucide-react';
import MapFilterControls from '@/components/MapFilterControls';
import WelcomeHeader from '@/components/WelcomeHeader';
import { regions } from '@/services/categoryData';
import SearchDialog from './SearchDialog';

interface MapHeaderProps {
  isSearchExpanded: boolean;
  searchQuery: string;
  activeRegion: string;
  onExpandSearch: () => void;
  onSearchBlur: () => void;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  onRegionChange: (regionId: string) => void;
  onOpenBookmarks: () => void;
  onOpenOfflineMaps: () => void;
  onCenterUserLocation: () => void;
  userLocation: { lat: number; lng: number } | null;
  locations?: any[];
  isLoading?: boolean;
  onSelectLocation?: (location: any) => void;
}

const MapHeader: React.FC<MapHeaderProps> = ({
  isSearchExpanded,
  searchQuery,
  activeRegion,
  onExpandSearch,
  onSearchBlur,
  onSearchChange,
  onSearchClear,
  onRegionChange,
  onOpenBookmarks,
  onOpenOfflineMaps,
  onCenterUserLocation,
  userLocation,
  locations = [],
  isLoading = false,
  onSelectLocation = () => {},
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  
  // Auto-focus the search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Open search dialog when typing in input
  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      setIsSearchDialogOpen(true);
    }
  }, [searchQuery]);

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      {!isSearchExpanded && (
        <div className="mb-2">
          <WelcomeHeader 
            location={activeRegion !== 'all' ? regions.find(r => r.id === activeRegion)?.name : 'Saudi Arabia'} 
            className="text-white text-shadow-sm"
          />
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <div className={cn(
          "bg-white rounded-full shadow-lg flex items-center transition-all duration-300",
          isSearchExpanded ? "flex-1" : "w-10 h-10"
        )}>
          {isSearchExpanded ? (
            <div className="flex items-center flex-1 px-4 py-2">
              <Search className="h-5 w-5 text-muted-foreground mr-2" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onBlur={onSearchBlur}
                className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent"
                autoComplete="off"
                onFocus={() => {
                  if (searchQuery) {
                    setIsSearchDialogOpen(true);
                  }
                }}
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={onSearchClear}
                >
                  <span className="sr-only">Clear</span>
                  <span className="text-xl">&times;</span>
                </Button>
              )}
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full" 
              onClick={onExpandSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-white rounded-full shadow-lg">
              <Filter className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <MapFilterControls 
              activeRegion={activeRegion} 
              onRegionChange={onRegionChange} 
            />
          </SheetContent>
        </Sheet>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-white rounded-full shadow-lg">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpenBookmarks}>
              <BookmarkIcon className="h-4 w-4 mr-2" />
              My Bookmarks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenOfflineMaps}>
              <Download className="h-4 w-4 mr-2" />
              Offline Maps
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {userLocation && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 bg-white rounded-full shadow-lg"
            onClick={onCenterUserLocation}
          >
            <Navigation className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Search Dialog */}
      <SearchDialog 
        isOpen={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        locations={locations}
        isLoading={isLoading}
        onSelectLocation={onSelectLocation}
      />
    </div>
  );
};

export default MapHeader;
