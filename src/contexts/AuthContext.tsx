
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, AuthState } from '@/types/user';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
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
  language: 'en'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Update auth state based on session changes
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(state => ({ ...state, session, user: session?.user || null }));
        
        // Fetch user profile when session changes
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setAuthState(state => ({ ...state, profile: null }));
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(state => ({ ...state, session, user: session?.user || null }));
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setAuthState(state => ({ ...state, isLoading: false }));
      }
    });

    // Load language preference
    const savedLanguage = localStorage.getItem('aaj_language') as 'en' | 'ar';
    if (savedLanguage) {
      setAuthState(state => ({ ...state, language: savedLanguage }));
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setAuthState(state => ({ 
        ...state, 
        profile: data as UserProfile, 
        isLoading: false,
        language: data.preferred_language || state.language
      }));
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setAuthState(state => ({ ...state, isLoading: false }));
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

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
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
    }
  };

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
        signOut,
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
