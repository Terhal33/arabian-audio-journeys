
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  preferred_language: 'en' | 'ar';
  created_at: string;
  updated_at: string;
}

// Extended user type with additional properties
export interface ExtendedUser extends User {
  name?: string;
  isPremium?: boolean;
}

export interface AuthState {
  user: ExtendedUser | null;
  profile: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  language: 'en' | 'ar';
}
