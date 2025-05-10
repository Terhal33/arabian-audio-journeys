
import React from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const MapPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-6 bg-sand-light">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2 text-desert-dark">
              Explore the Map
            </h1>
            <p className="text-muted-foreground">
              Discover audio tours at locations across Saudi Arabia
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 h-[calc(100vh-250px)] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Map view coming soon</p>
              <Button className="bg-desert hover:bg-desert-dark">
                View Available Locations
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapPage;
