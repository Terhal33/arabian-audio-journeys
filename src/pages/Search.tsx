
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { tours } from '@/services/toursData';
import EnhancedTourCard from '@/components/EnhancedTourCard';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false);
      }, 500);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const filteredTours = tours.filter(tour => {
    // Skip filtering if search is empty
    if (!searchQuery.trim()) return false;
    
    // Handle title search
    const titleMatches = tour.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Handle location search
    let locationMatches = false;
    
    if (tour.location) {
      // For location objects, convert coordinates to string for searching
      const locationStr = `${tour.location.lat} ${tour.location.lng}`;
      locationMatches = locationStr.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return titleMatches || locationMatches;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-6 bg-sand-light">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-4 text-desert-dark">
              Search Tours
            </h1>
            
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by location, title, or keywords..."
                  className="pl-10 pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <Button type="submit">Search</Button>
              </div>
            </form>
            
            {searchQuery && !isSearching && (
              <p className="text-muted-foreground mb-4">
                Found {filteredTours.length} results for "{searchQuery}"
              </p>
            )}
          </div>
          
          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="h-52 w-full" />
                  <div className="p-5">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchQuery && filteredTours.map(tour => (
                <EnhancedTourCard key={tour.id} tour={tour} />
              ))}
              
              {searchQuery && filteredTours.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No tours found matching your search.</p>
                  <p className="mt-2">Try different keywords or browse our <Button variant="link" className="p-0" onClick={clearSearch}>featured tours</Button>.</p>
                </div>
              )}
              
              {!searchQuery && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">Enter a search term to find tours.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
