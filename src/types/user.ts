
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

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  language: 'en' | 'ar';
}
