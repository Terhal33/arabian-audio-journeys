
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';

export const createUserProfile = async (userId: string, fullName: string, language: 'en' | 'ar') => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      full_name: fullName,
      preferred_language: language,
      username: fullName.toLowerCase().replace(/\s+/g, '_')
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }

  return data;
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching user profile:', error);
    throw error;
  }

  return data;
};

export const authMethods = {
  signUp: async (email: string, password: string, fullName: string, language: 'en' | 'ar') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          preferred_language: language
        }
      }
    });

    if (error) throw error;
    return data;
  },

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  updateProfile: async (updates: Partial<UserProfile>, userId: string) => {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
};
