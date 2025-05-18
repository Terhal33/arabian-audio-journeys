
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, Star, Clock, Map, Award, Download, Settings, 
  Bookmark, BarChart3, Shield, Heart
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Badge } from '@/components/ui/badge';

// Mock data for demonstration purposes
const ACHIEVEMENTS = [
  { id: 1, name: 'Explorer', description: 'Completed first tour', icon: <Map className="h-4 w-4 text-white" />, earned: true },
  { id: 2, name: 'Historian', description: 'Completed 5 historical tours', icon: <Clock className="h-4 w-4 text-white" />, earned: true },
  { id: 3, name: 'Cultural Enthusiast', description: 'Listened to 10+ hours of content', icon: <Award className="h-4 w-4 text-white" />, earned: false },
  { id: 4, name: 'Saudi Explorer', description: 'Visited all major regions', icon: <Map className="h-4 w-4 text-white" />, earned: false },
];

const FAVORITE_TOURS = [
  { id: 'diriyah-main', name: 'Diriyah Historic District', image: '/placeholder.svg', duration: '45 min' },
  { id: 'jeddah-historical', name: 'Historic Jeddah', image: '/placeholder.svg', duration: '60 min' },
  { id: 'riyadh-boulevard', name: 'Riyadh Boulevard', image: '/placeholder.svg', duration: '30 min' },
];

const DOWNLOADED_TOURS = [
  { id: 'diriyah-main', name: 'Diriyah Historic District', size: '45 MB', date: '2 days ago' },
  { id: 'jeddah-historical', name: 'Historic Jeddah', size: '60 MB', date: '1 week ago' },
];

const Profile = () => {
  const { user, profile, logout, isPremium = false } = useAuth();
  const navigate = useNavigate();
  
  // User progress stats
  const [stats, setStats] = useState({
    toursCompleted: 5,
    toursStarted: 8,
    hoursListened: 4.5,
    favoritePlaces: 3,
    achievements: 2,
  });
  
  // Recent activity
  const [recentTours] = useState([
    { id: 'diriyah-main', name: 'Diriyah Historic District', date: '2 days ago', progress: 75 },
    { id: 'jeddah-historical', name: 'Historic Jeddah', date: '1 week ago', progress: 100 },
  ]);
  
  const [storageUsage] = useState({
    used: 105, // MB
    total: 500, // MB
    percentage: 21
  });
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <main className="flex-1 py-6 bg-sand-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* User Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="h-20 w-20 bg-desert rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile?.full_name || "User"} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start mb-1">
                    <h1 className="text-2xl font-bold">
                      {profile?.full_name || user.email}
                    </h1>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => navigate('/settings')}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground mb-2">{user.email}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
                  </p>
                  
                  <div className="flex items-center space-x-4 flex-wrap gap-y-2">
                    <div className="flex items-center">
                      <Map className="h-4 w-4 text-desert mr-1" />
                      <span className="text-sm">{stats.toursCompleted} tours completed</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-gold mr-1" />
                      <span className="text-sm">{stats.favoritePlaces} favorites</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-desert-dark mr-1" />
                      <span className="text-sm">{stats.hoursListened} hours listened</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-gold-dark mr-1" />
                      <span className="text-sm">{stats.achievements} achievements</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subscription Status */}
              <div className={`mt-6 ${isPremium ? 'bg-gold/10' : 'bg-desert/10'} p-4 rounded-md`}>
                <h3 className={`font-semibold ${isPremium ? 'text-gold-dark' : 'text-desert-dark'} mb-1`}>
                  {isPremium ? 'Premium Subscription' : 'Free Account'}
                </h3>
                <p className="text-sm mb-3">
                  {isPremium 
                    ? 'Enjoy unlimited access to all premium tours and exclusive content.'
                    : 'Upgrade to Premium for unlimited access to all audio tours and exclusive content.'}
                </p>
                <Button 
                  size="sm" 
                  className={isPremium 
                    ? "bg-gold hover:bg-gold-dark text-night" 
                    : "bg-desert hover:bg-desert-dark"}
                >
                  {isPremium ? 'Manage Subscription' : 'Upgrade to Premium'}
                </Button>
              </div>
            </div>
            
            {/* Profile Content Tabs */}
            <Tabs defaultValue="activity" className="mb-16">
              <TabsList className="mb-6">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="downloads">Downloads</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              {/* Activity Tab */}
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
                          <div key={tour.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4">
                            <div>
                              <h4 className="font-medium">{tour.name}</h4>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{tour.date}</span>
                              </p>
                            </div>
                            <div className="mt-2 sm:mt-0 sm:ml-4 flex-1 max-w-xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Progress</span>
                                <span className="text-xs font-medium">{tour.progress}%</span>
                              </div>
                              <Progress value={tour.progress} className="h-2" />
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="mt-2 sm:mt-0 sm:ml-4"
                              onClick={() => navigate(`/tour/${tour.id}`)}
                            >
                              {tour.progress === 100 ? 'Replay' : 'Continue'}
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
                  <CardFooter className="flex justify-between pt-2">
                    <div className="text-sm text-muted-foreground">
                      Tours started: {stats.toursStarted} • Completed: {stats.toursCompleted}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/tours')}>
                      View All Tours
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Favorites Tab */}
              <TabsContent value="favorites">
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Tours</CardTitle>
                    <CardDescription>Tours you've saved as favorites</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {FAVORITE_TOURS.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {FAVORITE_TOURS.map(tour => (
                          <div key={tour.id} className="border rounded-lg overflow-hidden flex flex-col">
                            <div className="h-32 bg-muted relative">
                              <img 
                                src={tour.image} 
                                alt={tour.name} 
                                className="h-full w-full object-cover" 
                              />
                              <div className="absolute bottom-0 right-0 p-1.5">
                                <Badge className="bg-gold text-night font-medium">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {tour.duration}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-3 flex flex-col flex-1">
                              <h4 className="font-medium line-clamp-2 mb-2">{tour.name}</h4>
                              <div className="mt-auto flex justify-between items-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gold hover:text-gold-dark"
                                >
                                  <Heart className="h-4 w-4 fill-current" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/tour/${tour.id}`)}
                                >
                                  View Tour
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You haven't saved any favorites yet.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Tap the heart icon on any tour to add it to your favorites.
                        </p>
                        <Button className="mt-4" onClick={() => navigate('/tours')}>
                          Browse Tours
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Downloads Tab */}
              <TabsContent value="downloads">
                <Card>
                  <CardHeader>
                    <CardTitle>Downloaded Tours</CardTitle>
                    <CardDescription>Tours available for offline listening</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-2">Storage Usage</h4>
                      <div className="flex justify-between mb-1 text-xs">
                        <span>{storageUsage.used} MB used</span>
                        <span>{storageUsage.total} MB total</span>
                      </div>
                      <Progress value={storageUsage.percentage} className="h-2" />
                    </div>
                    
                    {DOWNLOADED_TOURS.length > 0 ? (
                      <div className="space-y-3">
                        {DOWNLOADED_TOURS.map(tour => (
                          <div key={tour.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <h4 className="font-medium">{tour.name}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-muted-foreground">{tour.size}</span>
                                <span className="text-xs text-muted-foreground">Downloaded {tour.date}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive/80"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/tour/${tour.id}`)}
                              >
                                Listen
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You haven't downloaded any tours yet.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Downloaded tours are available for offline listening.
                        </p>
                        <Button className="mt-4" onClick={() => navigate('/tours')}>
                          Find Tours to Download
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Manage Downloads
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Milestones you've reached on your journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {ACHIEVEMENTS.map(achievement => (
                        <div 
                          key={achievement.id} 
                          className={`border ${achievement.earned ? 'border-gold' : 'border-muted'} rounded-lg p-4 flex items-center gap-4`}
                        >
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-gold' : 'bg-muted'}`}>
                            {achievement.icon}
                          </div>
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {achievement.name}
                              {achievement.earned && (
                                <Badge className="bg-gold text-night">Earned</Badge>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      Continue exploring to unlock more achievements!
                    </p>
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
