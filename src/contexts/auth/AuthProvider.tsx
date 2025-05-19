import React, { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, ExtendedUser } from '@/types/user';
import { AuthContextType, AuthState } from './types';
import { createUserProfile, fetchUserProfile, authMethods } from './authUtils';

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  language: 'en'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const authCheckInProgress = useRef(false);

  // Update auth state based on session changes
  useEffect(() => {
    // Prevent multiple simultaneous auth checks
    if (authCheckInProgress.current) return;
    
    authCheckInProgress.current = true;
    console.log('Setting up auth listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
        const isAuthenticated = !!session?.user;
        setAuthState(state => ({ 
          ...state, 
          session, 
          user: session?.user as ExtendedUser || null,
          isAuthenticated
        }));
        
        // Fetch user profile when session changes
        if (session?.user) {
          setTimeout(() => {
            handleFetchUserProfile(session.user.id);
          }, 0);
        } else {
          setAuthState(state => ({ 
            ...state, 
            profile: null, 
            isAuthenticated: false,
            isLoading: false
          }));
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Session exists' : 'No session');
      const isAuthenticated = !!session?.user;
      
      setAuthState(state => ({ 
        ...state, 
        session, 
        user: session?.user as ExtendedUser || null,
        isAuthenticated,
        isLoading: false
      }));
      
      if (session?.user) {
        handleFetchUserProfile(session.user.id);
      }
      
      // Reset the auth check flag
      authCheckInProgress.current = false;
    });

    // Load language preference
    const savedLanguage = localStorage.getItem('aaj_language') as 'en' | 'ar';
    if (savedLanguage) {
      setAuthState(state => ({ ...state, language: savedLanguage }));
    }

    return () => {
      subscription.unsubscribe();
      authCheckInProgress.current = false;
    };
  }, []);

  const handleFetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      let userProfile = await fetchUserProfile(userId);

      if (!userProfile) {
        console.log('User profile not found, creating new profile...');
        // Get user data from auth
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        
        if (user) {
          const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
          userProfile = await createUserProfile(userId, userName, user.email, authState.language);
        }
      }

      if (userProfile) {
        // Create extended user with additional properties
        const extendedUser = authState.user ? {
          ...authState.user,
          name: userProfile.full_name,
          isPremium: false // Default value, update based on your premium status logic
        } : null;

        setAuthState(state => ({ 
          ...state, 
          profile: userProfile, 
          user: extendedUser,
          isLoading: false,
          language: userProfile.preferred_language as 'en' | 'ar' || state.language
        }));
      } else {
        // Even if profile creation fails, we still want to set isLoading to false
        setAuthState(state => ({ ...state, isLoading: false }));
      }
    } catch (error) {
      console.error('Error handling user profile:', error);
      setAuthState(state => ({ ...state, isLoading: false }));
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    await authMethods.signUp(email, password, fullName, authState.language);
  };

  const signIn = async (email: string, password: string) => {
    await authMethods.signIn(email, password);
  };

  // Enhanced logout method with complete cleanup
  const logout = async (): Promise<void> => {
    try {
      // Set loading state
      setAuthState(state => ({ ...state, isLoading: true }));
      
      // Sign out from Supabase
      await authMethods.logout();
      
      // Clear all auth state
      setAuthState(state => ({ 
        ...state, 
        user: null, 
        profile: null, 
        session: null, 
        isAuthenticated: false,
        isLoading: false
      }));
      
      // Optionally keep language preference
      const language = localStorage.getItem('aaj_language');
      
      // Reset app state for fresh login (but keep onboarded status)
      const onboardedStatus = localStorage.getItem('aaj_onboarded');
      
      // Clear local storage but keep minimal preferences
      localStorage.clear();
      
      // Restore preferences we want to keep
      if (language) localStorage.setItem('aaj_language', language);
      if (onboardedStatus) localStorage.setItem('aaj_onboarded', onboardedStatus);
    } catch (error) {
      console.error('Error signing out:', error);
      // Reset loading state on error
      setAuthState(state => ({ ...state, isLoading: false }));
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user?.id) return;
    
    await authMethods.updateProfile(updates, authState.user.id);
    await handleFetchUserProfile(authState.user.id);
  };

  const resetPassword = async (email: string) => {
    await authMethods.resetPassword(email);
  };

  const setLanguage = (lang: 'en' | 'ar') => {
    setAuthState(state => ({ ...state, language: lang }));
    localStorage.setItem('aaj_language', lang);
    
    // If user is logged in, update their profile
    if (authState.user && authState.profile) {
      updateProfile({ preferred_language: lang }).catch(console.error);
    }
  };

  const refreshProfile = async () => {
    if (authState.user) {
      await handleFetchUserProfile(authState.user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        isPremium: !!authState.user?.isPremium,
        signUp,
        signIn,
        logout,
        signOut: logout,
        resetPassword,
        updateProfile,
        setLanguage,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
