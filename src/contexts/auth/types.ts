
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/user';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  language: 'en' | 'ar';
}

export interface AuthContextType extends AuthState {
  isPremium: boolean;
  userRole: 'admin' | 'customer' | null;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setLanguage: (lang: 'en' | 'ar') => void;
  refreshProfile: () => Promise<void>;
}
