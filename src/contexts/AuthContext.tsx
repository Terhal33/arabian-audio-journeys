import React, { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, AuthState, ExtendedUser } from '@/types/user';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias for logout to maintain backward compatibility
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setLanguage: (lang: 'en' | 'ar') => void;
  refreshProfile: () => Promise<void>;
}

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
  const authCheckInProgress = useRef(false); // Add a ref to track if auth check is in progress

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
            fetchUserProfile(session.user.id);
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
        isAuthenticated
      }));
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setAuthState(state => ({ ...state, isLoading: false }));
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

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If user profile doesn't exist, create one instead of throwing an error
        if (error.code === 'PGRST116') {
          console.log('User profile not found, creating new profile...');
          return createUserProfile(userId);
        }
        throw error;
      }

      // Create extended user with additional properties
      const extendedUser = authState.user ? {
        ...authState.user,
        name: data.full_name,
        isPremium: false // Default value, update based on your premium status logic
      } : null;

      setAuthState(state => ({ 
        ...state, 
        profile: data as UserProfile, 
        user: extendedUser,
        isLoading: false,
        language: data.preferred_language as 'en' | 'ar' || state.language
      }));
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setAuthState(state => ({ ...state, isLoading: false }));
    }
  };

  // New function to create user profile if it doesn't exist
  const createUserProfile = async (userId: string) => {
    try {
      // Get user data from auth
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const user = userData.user;
      const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
      const preferred_language = authState.language || 'en';

      // Define the new profile with required id field
      const newProfile = {
        id: userId,
        full_name: userName,
        username: user.email,
        preferred_language,
        avatar_url: null
      };

      // Try the insert, but don't fail if it doesn't work (profile might already exist)
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .insert(newProfile)
          .select()
          .single();

        if (error) {
          console.log('Error creating profile, falling back to direct authentication:', error);
          // If we can't create a profile, just continue with the user info we have
          const extendedUser = authState.user ? {
            ...authState.user,
            name: userName,
            isPremium: false
          } : null;

          setAuthState(state => ({ 
            ...state, 
            profile: {
              id: userId,
              full_name: userName,
              username: user.email,
              preferred_language,
              avatar_url: null
            } as UserProfile, 
            user: extendedUser,
            isLoading: false,
            language: preferred_language
          }));
          
          return null;
        }

        // Create extended user with additional properties
        const extendedUser = authState.user ? {
          ...authState.user,
          name: data.full_name,
          isPremium: false
        } : null;

        setAuthState(state => ({ 
          ...state, 
          profile: data as UserProfile, 
          user: extendedUser,
          isLoading: false,
          language: preferred_language
        }));

        return data;
      } catch (insertError) {
        console.error('Error in profile insert transaction:', insertError);
        // Even if profile creation fails, we still want to set isLoading to false
        // and provide minimal user functionality
        const extendedUser = authState.user ? {
          ...authState.user,
          name: userName,
          isPremium: false
        } : null;

        setAuthState(state => ({ 
          ...state, 
          user: extendedUser,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      // Even if profile creation fails, we should still set isLoading to false
      setAuthState(state => ({ ...state, isLoading: false }));
      return null;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            preferred_language: authState.language
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account.",
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Signed in",
        description: "You have successfully signed in.",
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  };

  // Enhanced logout method with complete cleanup - Fix the return type to Promise<void>
  const logout = async (): Promise<void> => {
    try {
      // Set loading state
      setAuthState(state => ({ ...state, isLoading: true }));
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all auth state
      setAuthState(state => ({ 
        ...state, 
        user: null, 
        profile: null, 
        session: null, 
        isAuthenticated: false,
        isLoading: false
      }));
      
      // Remove any stored authentication data or tokens
      localStorage.removeItem('redirectAfterLogin');
      
      // Optionally keep language preference
      const language = localStorage.getItem('aaj_language');
      
      // Reset app state for fresh login (but keep onboarded status)
      const onboardedStatus = localStorage.getItem('aaj_onboarded');
      
      // Clear local storage but keep minimal preferences
      localStorage.clear();
      
      // Restore preferences we want to keep
      if (language) localStorage.setItem('aaj_language', language);
      if (onboardedStatus) localStorage.setItem('aaj_onboarded', onboardedStatus);
      
      // Successfully logged out
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Failed to sign out. Please try again.",
      });
      
      // Reset loading state on error
      setAuthState(state => ({ ...state, isLoading: false }));
    }
  };

  // Alias for logout to maintain backward compatibility - Fix the return type to Promise<void>
  const signOut = logout;

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      toast({
        title: "Reset email sent",
        description: "Check your email for a password reset link.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', authState.user?.id as string);

      if (error) throw error;

      await fetchUserProfile(authState.user?.id as string);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
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
      await fetchUserProfile(authState.user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signUp,
        signIn,
        logout,
        signOut: logout, // Alias for backward compatibility
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
