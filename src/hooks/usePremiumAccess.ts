
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export interface PremiumAccessOptions {
  redirectToUpgrade?: boolean;
  showToast?: boolean;
  toastMessage?: string;
}

const defaultOptions: PremiumAccessOptions = {
  redirectToUpgrade: false,
  showToast: true,
  toastMessage: "This content requires a premium subscription"
};

/**
 * Hook for checking premium access and handling non-premium users
 */
export const usePremiumAccess = (options: PremiumAccessOptions = {}) => {
  const { isPremium, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = useState(false);
  
  const mergedOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    if (!isLoading) {
      // If user is not authenticated, they need to login first
      if (!isAuthenticated) {
        if (mergedOptions.showToast) {
          toast({
            title: "Login required",
            description: "Please login to access this content",
          });
        }
        if (mergedOptions.redirectToUpgrade) {
          navigate('/login', { state: { from: window.location.pathname } });
        }
      } 
      // If user is authenticated but not premium
      else if (!isPremium) {
        if (mergedOptions.showToast) {
          toast({
            title: "Premium content",
            description: mergedOptions.toastMessage,
          });
        }
        if (mergedOptions.redirectToUpgrade) {
          navigate('/subscription');
        }
      }
      
      setHasChecked(true);
    }
  }, [isPremium, isLoading, isAuthenticated, navigate, mergedOptions]);

  return {
    isPremium,
    isLoading: isLoading || !hasChecked,
    canAccess: isPremium && isAuthenticated,
    needsUpgrade: isAuthenticated && !isPremium
  };
};

export default usePremiumAccess;
