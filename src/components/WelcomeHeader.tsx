
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WelcomeHeaderProps {
  location?: string;
  isLoading?: boolean;
}

const WelcomeHeader = ({ location = "Saudi Arabia", isLoading = false }: WelcomeHeaderProps) => {
  const { user } = useAuth();
  
  // Safely extract the first name without causing refreshes
  const userName = React.useMemo(() => {
    if (!user || !user.name) return '';
    return user.name.split(' ')[0];
  }, [user?.name]);

  return (
    <div className="mb-6">
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ) : (
        <>
          <h1 className="font-display text-3xl font-bold mb-1 text-desert-dark">
            {userName ? `Welcome, ${userName}` : 'Welcome'}
          </h1>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <p>{location}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default WelcomeHeader;
