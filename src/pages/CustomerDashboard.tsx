
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Heart, Clock, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthProvider';

const CustomerDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-sand-light py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-desert-dark mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground">
            Continue your audio journey through Saudi Arabia
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/tours')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Headphones className="h-5 w-5 text-oasis" />
                Browse Tours
              </CardTitle>
              <CardDescription>
                Discover new audio experiences
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-red-500" />
                My Favorites
              </CardTitle>
              <CardDescription>
                Your saved tours (Coming Soon)
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your listening history (Coming Soon)
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recommended Tours Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>
              Based on your interests and location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Personalized Recommendations Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                We're working on creating personalized tour recommendations just for you.
              </p>
              <Button onClick={() => navigate('/tours')}>
                Explore All Tours
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
