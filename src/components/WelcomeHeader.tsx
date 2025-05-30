
import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface WelcomeHeaderProps {
  location?: string;
  isLoading?: boolean;
  className?: string;
}

const WelcomeHeader = React.memo(({ 
  location = "Saudi Arabia",
  isLoading = false,
  className 
}: WelcomeHeaderProps) => {
  const { user, profile } = useAuth();
  
  // Safely extract the first name from profile or user metadata
  const userName = useMemo(() => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return '';
  }, [profile?.full_name, user?.user_metadata?.full_name, user?.email]);

  return (
    <div className={cn("mb-6", className)}>
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
            <p className="animate-fade-in">{location}</p>
          </div>
        </>
      )}
    </div>
  );
});

WelcomeHeader.displayName = 'WelcomeHeader';

export default WelcomeHeader;
