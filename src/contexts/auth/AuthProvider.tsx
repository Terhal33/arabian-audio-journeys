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
  const [userRole, setUserRole] = useState<'admin' | 'customer' | null>(null);
  const authCheckInProgress = useRef(false);

  // Fetch user role from the database
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role as 'admin' | 'customer' || 'customer';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'customer';
    }
  };

  // Update auth state based on session changes
  useEffect(() => {
    if (authCheckInProgress.current) return;
    
    authCheckInProgress.current = true;
    console.log('Setting up auth listener...');
    
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
        
        if (session?.user) {
          setTimeout(() => {
            handleFetchUserProfile(session.user.id);
            fetchUserRole(session.user.id).then(role => {
              setUserRole(role);
            });
          }, 0);
        } else {
          setAuthState(state => ({ 
            ...state, 
            profile: null, 
            isAuthenticated: false,
            isLoading: false
          }));
          setUserRole(null);
        }
      }
    );

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
        fetchUserRole(session.user.id).then(role => {
          setUserRole(role);
        });
      }
      
      authCheckInProgress.current = false;
    });

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
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        
        if (user) {
          const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
          userProfile = await createUserProfile(userId, userName, user.email, authState.language);
        }
      }

      if (userProfile) {
        const extendedUser = authState.user ? {
          ...authState.user,
          name: userProfile.full_name,
          isPremium: false
        } : null;

        setAuthState(state => ({ 
          ...state, 
          profile: userProfile, 
          user: extendedUser,
          isLoading: false,
          language: userProfile.preferred_language as 'en' | 'ar' || state.language
        }));
      } else {
        setAuthState(state => ({ ...state, isLoading: false }));
      }
    } catch (error) {
      console.error('Error handling user profile:', error);
      setAuthState(state => ({ ...state, isLoading: false }));
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const result = await authMethods.signUp(email, password, fullName, authState.language);
      return result;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    await authMethods.signIn(email, password);
  };

  const logout = async (): Promise<void> => {
    try {
      setAuthState(state => ({ ...state, isLoading: true }));
      await authMethods.logout();
      
      setAuthState(state => ({ 
        ...state, 
        user: null, 
        profile: null, 
        session: null, 
        isAuthenticated: false,
        isLoading: false
      }));
      setUserRole(null);
      
      const language = localStorage.getItem('aaj_language');
      const onboardedStatus = localStorage.getItem('aaj_onboarded');
      localStorage.clear();
      if (language) localStorage.setItem('aaj_language', language);
      if (onboardedStatus) localStorage.setItem('aaj_onboarded', onboardedStatus);
    } catch (error) {
      console.error('Error signing out:', error);
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
        isPremium: false,
        userRole,
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
