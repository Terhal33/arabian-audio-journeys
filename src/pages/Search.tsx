
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { tours } from '@/services/toursData';
import TourCard from '@/components/TourCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTours = tours.filter(tour => {
    // Handle title search
    const titleMatches = tour.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Handle location search based on Tour interface
    let locationMatches = false;
    
    // The Tour interface defines location as an object with lat and lng
    if (tour.location && typeof tour.location === 'object') {
      // For location objects, convert coordinates to string for searching
      const locationStr = `${tour.location.lat} ${tour.location.lng}`;
      locationMatches = locationStr.includes(searchQuery);
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
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by location, title, or keywords..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {searchQuery && (
              <p className="text-muted-foreground mb-4">
                Found {filteredTours.length} results for "{searchQuery}"
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map(tour => (
              <TourCard key={tour.id} tour={tour} />
            ))}
            
            {searchQuery && filteredTours.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">No tours found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
