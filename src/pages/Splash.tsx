
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Splash = () => {
  const navigate = useNavigate();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          navigate('/tours');
        } else {
          // Check if user has seen onboarding
          const hasSeenOnboarding = localStorage.getItem('aaj_onboarded');
          if (hasSeenOnboarding === 'true') {
            navigate('/login');
          } else {
            navigate('/onboarding');
          }
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-sand-light">
      <div className="animate-pulse">
        <div className="text-5xl font-display font-bold text-center text-desert-dark">
          Arabian<span className="text-gold">Audio</span>
        </div>
        <div className="text-xl text-center text-muted-foreground mt-2">
          Your journey through Saudi Arabia's history
        </div>
      </div>
      
      <div className="absolute bottom-12 flex space-x-2 items-center">
        <div className={cn("audio-bar h-8")}></div>
        <div className={cn("audio-bar h-12")}></div>
        <div className={cn("audio-bar h-10")}></div>
        <div className={cn("audio-bar h-16")}></div>
        <div className={cn("audio-bar h-10")}></div>
        <div className={cn("audio-bar h-8")}></div>
      </div>
    </div>
  );
};

export default Splash;
