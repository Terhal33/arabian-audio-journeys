import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, Settings, Crown, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthProvider';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, profile, logout, isPremium, isAuthenticated } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to access your profile",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Navigation will be handled by the auth state change
      toast({
        title: "Logged out successfully",
        description: "You have been signed out",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again."
      });
      setIsLoggingOut(false);
    }
  };

  const getInitials = () => {
    if (!profile?.full_name) return user?.email?.substring(0, 2).toUpperCase() || 'U';
    return profile.full_name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // If not authenticated, show minimal UI while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-light">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Authentication Required</h1>
          <p className="mb-4">Please login to access your profile</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-sand-light">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
              <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <h1 className="font-display text-3xl font-bold mb-2 text-desert-dark">
              {profile?.full_name || user?.email?.split('@')[0]}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
            
            {isPremium ? (
              <div className="mt-4 flex justify-center">
                <div className="bg-gold/10 text-gold px-3 py-1 rounded-full flex items-center">
                  <Crown className="h-4 w-4 mr-1" /> Premium User
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="bg-gold/10 text-gold border-gold/20 hover:bg-gold/20"
                  asChild
                >
                  <Link to="/subscription">
                    <Crown className="h-4 w-4 mr-2" /> Upgrade to Premium
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <div className="grid gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="font-medium text-lg mb-4">Personal Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <p className="text-sm font-medium">Full Name</p>
                          <p className="text-muted-foreground">
                            {profile?.full_name || 'Not set'}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/settings">Edit</Link>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <p className="text-sm font-medium">Email Address</p>
                          <p className="text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="font-medium text-lg mb-4">Subscription</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Crown className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <p className="text-sm font-medium">Current Plan</p>
                          <p className="text-muted-foreground">
                            {isPremium ? 'Premium' : 'Free'}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={isPremium ? "/subscription-management" : "/subscription"}>
                          {isPremium ? 'Manage' : 'Upgrade'}
                        </Link>
                      </Button>
                    </div>
                    
                    {isPremium && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-muted-foreground mr-2" />
                          <div>
                            <p className="text-sm font-medium">Billing</p>
                            <p className="text-muted-foreground">
                              Manage payment methods and view invoices
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/subscription-management">View</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="font-medium text-lg mb-4">Account Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <p className="text-sm font-medium">Account Settings</p>
                          <p className="text-muted-foreground">
                            Manage your profile and preferences
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/settings">Settings</Link>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <LogOut className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <p className="text-sm font-medium">Log Out</p>
                          <p className="text-muted-foreground">
                            Sign out of your account
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? 'Logging out...' : 'Log Out'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="font-medium text-lg mb-4">App Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Language</p>
                      <p className="text-muted-foreground">
                        {profile?.preferred_language === 'ar' ? 'Arabic' : 'English'}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/settings">Change</Link>
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Notifications</p>
                      <p className="text-muted-foreground">
                        Manage notification preferences
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/settings">Change</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
