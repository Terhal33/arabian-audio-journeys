
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Library, Bookmark, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LibraryPage = () => {
  const { user } = useAuth();
  
  // Mock data for demo purposes
  const [favorites] = useState([
    { id: 'diriyah-main', title: 'Diriyah Historic District', image: '/placeholder.svg' },
    { id: 'jeddah-historical', title: 'Historic Jeddah', image: '/placeholder.svg' },
  ]);
  
  const [downloads] = useState([
    { id: 'al-ula-heritage', title: 'AlUla Heritage Sites', image: '/placeholder.svg' },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-6 bg-sand-light">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold mb-2 text-desert-dark">
              Your Library
            </h1>
            <p className="text-muted-foreground">
              Access your saved and downloaded tours
            </p>
          </div>
          
          <Tabs defaultValue="favorites">
            <TabsList className="mb-6">
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" /> Favorites
              </TabsTrigger>
              <TabsTrigger value="downloads" className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Downloads
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="favorites">
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h3 className="font-medium mb-2">{item.title}</h3>
                        <Button asChild variant="outline" className="w-full">
                          <Link to={`/tour/${item.id}`}>View Tour</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Save your favorite tours for quick access
                  </p>
                  <Button asChild>
                    <Link to="/tours">Explore Tours</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="downloads">
              {downloads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {downloads.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h3 className="font-medium mb-2">{item.title}</h3>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" className="flex-1">
                            <Link to={`/tour/${item.id}`}>View Tour</Link>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No downloads yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Download tours for offline listening
                  </p>
                  <Button asChild>
                    <Link to="/tours">Explore Tours</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;
