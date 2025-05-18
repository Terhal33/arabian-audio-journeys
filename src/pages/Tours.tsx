
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { tours } from '@/services/toursData';
import EnhancedTourCard from '@/components/EnhancedTourCard';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UpgradePrompt from '@/components/UpgradePrompt';

const Tours = () => {
  const { isAuthenticated } = useAuth();
  const isPremium = false; // For demo purposes
  
  const [sortOrder, setSortOrder] = useState<string>('featured');
  
  // Downloaded tours (hardcoded for demo)
  const downloadedTourIds = ['diriyah-main'];
  
  // Filter tours by type
  const premiumTours = tours.filter(tour => tour.isPremium);
  const freeTours = tours.filter(tour => !tour.isPremium);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 bg-sand-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="font-display text-3xl font-bold mb-4 md:mb-0 text-desert-dark">
              Explore Our Tours
            </h1>
            
            <div className="flex items-center">
              <Select 
                defaultValue="featured"
                onValueChange={setSortOrder}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="nearest">Nearest First</SelectItem>
                  <SelectItem value="duration">Shortest Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Tours</TabsTrigger>
              <TabsTrigger value="free">Free</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
              <TabsTrigger value="downloaded">Downloaded</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map(tour => (
                  <EnhancedTourCard
                    key={tour.id}
                    tour={tour}
                    isDownloaded={downloadedTourIds.includes(tour.id)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="free">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freeTours.map(tour => (
                  <EnhancedTourCard
                    key={tour.id}
                    tour={tour}
                    isDownloaded={downloadedTourIds.includes(tour.id)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="premium">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumTours.length > 0 ? (
                  premiumTours.map(tour => (
                    <EnhancedTourCard
                      key={tour.id}
                      tour={tour}
                      isDownloaded={downloadedTourIds.includes(tour.id)}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground mb-4">No premium tours found.</p>
                  </div>
                )}
              </div>
              
              {!isPremium && premiumTours.length > 0 && (
                <div className="mt-8">
                  <UpgradePrompt 
                    variant="banner"
                    title="Unlock all premium tours with a subscription"
                    buttonText="Get Premium"
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="downloaded">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours
                  .filter(tour => downloadedTourIds.includes(tour.id))
                  .map(tour => (
                    <EnhancedTourCard
                      key={tour.id}
                      tour={tour}
                      isDownloaded={true}
                    />
                  ))}
                
                {tours.filter(tour => downloadedTourIds.includes(tour.id)).length === 0 && (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground mb-4">You haven't downloaded any tours yet.</p>
                    <Button asChild>
                      <Link to="/tours">Browse Tours</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {!isPremium && (
            <div className="mt-12">
              <UpgradePrompt 
                title="Upgrade to Premium"
                description="Get unlimited access to all premium tours and exclusive content!"
                buttonText="Upgrade Now"
                onUpgrade={() => console.log("Upgrade clicked")}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tours;
