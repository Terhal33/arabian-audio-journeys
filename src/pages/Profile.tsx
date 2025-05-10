
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Star, Clock, Map } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Since we're using mock data, these would be populated from a real API in a production app
  const [recentTours] = useState([
    { id: 'diriyah-main', name: 'Diriyah Historic District', date: '2 days ago' },
    { id: 'jeddah-historical', name: 'Historic Jeddah', date: '1 week ago' },
  ]);
  
  const [favoriteCount] = useState(3);
  const [completedCount] = useState(5);
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 bg-sand-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* User Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="h-20 w-20 bg-desert rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  <User className="h-10 w-10 text-white" />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                  <p className="text-muted-foreground mb-4">{user.email}</p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Map className="h-4 w-4 text-desert mr-1" />
                      <span className="text-sm">{completedCount} tours completed</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-gold mr-1" />
                      <span className="text-sm">{favoriteCount} favorites</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 flex flex-col space-y-3">
                  <Button className="bg-desert hover:bg-desert-dark">
                    {user.isPremium ? 'Manage Subscription' : 'Upgrade to Premium'}
                  </Button>
                  
                  <Button variant="outline" onClick={() => navigate('/tours')}>
                    Browse Tours
                  </Button>
                </div>
              </div>
              
              {!user.isPremium && (
                <div className="mt-8 bg-gold/10 p-4 rounded-md">
                  <h3 className="font-semibold text-gold-dark mb-1">Upgrade to Premium</h3>
                  <p className="text-sm mb-3">
                    Get access to our complete library of premium audio tours and exclusive content.
                  </p>
                  <Button size="sm" className="bg-gold hover:bg-gold-dark text-night">
                    See Premium Benefits
                  </Button>
                </div>
              )}
            </div>
            
            {/* Profile Content */}
            <Tabs defaultValue="activity">
              <TabsList className="mb-6">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Tours you've recently viewed or completed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentTours.length > 0 ? (
                      <div className="space-y-4">
                        {recentTours.map(tour => (
                          <div key={tour.id} className="flex items-center justify-between border-b pb-3">
                            <div>
                              <h4 className="font-medium">{tour.name}</h4>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{tour.date}</span>
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/tour/${tour.id}`)}
                            >
                              Continue
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You haven't explored any tours yet.</p>
                        <Button className="mt-4" onClick={() => navigate('/tours')}>
                          Discover Tours
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="favorites">
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Tours</CardTitle>
                    <CardDescription>Tours you've saved as favorites</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Feature coming soon!</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        You'll be able to save your favorite tours for quick access.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Profile Information</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Update your account information
                      </p>
                      <Button variant="outline">Edit Profile</Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">Preferences</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Customize your app experience
                      </p>
                      <Button variant="outline">Manage Preferences</Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all your data
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="ghost" onClick={() => navigate('/tours')}>
                      Cancel
                    </Button>
                    <Button onClick={logout}>
                      Sign Out
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
