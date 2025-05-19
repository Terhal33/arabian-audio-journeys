
import { User } from '@supabase/supabase-js';
import { UserProfile, ExtendedUser } from '@/types/user';

export interface AuthState {
  user: ExtendedUser | null;
  profile: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  language: 'en' | 'ar';
  isPremium?: boolean;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, fullName: string) => Promise<{ user: User; email: string; emailJustSent: boolean; } | undefined>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setLanguage: (language: 'en' | 'ar') => void;
  refreshProfile: () => Promise<void>;
}
