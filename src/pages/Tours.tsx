
import { useState } from 'react';
import { tours } from '@/services/toursData';
import TourCard from '@/components/TourCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const Tours = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  
  const freeTours = tours.filter(tour => !tour.isPremium);
  const premiumTours = tours.filter(tour => tour.isPremium);
  
  const filterTours = (tourList: typeof tours) => {
    if (!searchQuery) return tourList;
    
    const query = searchQuery.toLowerCase();
    return tourList.filter(tour => 
      tour.title.toLowerCase().includes(query) || 
      tour.description.toLowerCase().includes(query)
    );
  };
  
  const filteredFreeTours = filterTours(freeTours);
  const filteredPremiumTours = filterTours(premiumTours);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 bg-sand-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-desert-dark">Audio Tours</h1>
              <p className="mt-1 text-muted-foreground">Discover Saudi Arabia's rich heritage through sound</p>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Tours</TabsTrigger>
              <TabsTrigger value="free">Free Tours</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              {!isAuthenticated && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-sand mb-6">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-desert-dark">Sign in</span> to access all tours and premium content.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterTours(tours).map(tour => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
              
              {filterTours(tours).length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No tours found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="free" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFreeTours.map(tour => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
              
              {filteredFreeTours.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No free tours found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="premium" className="space-y-6">
              {!isAuthenticated ? (
                <div className="bg-white rounded-lg shadow-sm border border-sand p-6 text-center">
                  <h3 className="font-display text-xl font-semibold mb-2 text-desert-dark">Premium Content</h3>
                  <p className="text-muted-foreground mb-4">
                    Sign in or create an account to access our premium audio tours.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button asChild variant="outline" className="border-oasis text-oasis hover:bg-oasis/10">
                      <a href="/login">Sign In</a>
                    </Button>
                    <Button asChild className="bg-desert hover:bg-desert-dark">
                      <a href="/signup">Create Account</a>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPremiumTours.map(tour => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                  
                  {filteredPremiumTours.length === 0 && (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium mb-2">No premium tours found</h3>
                      <p className="text-muted-foreground">Try adjusting your search criteria</p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Tours;
