
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

  // Ensure preferred_language is properly typed
  return {
    ...data,
    preferred_language: (data.preferred_language as 'en' | 'ar') || 'en'
  };
};

export const getUserFriendlyErrorMessage = (error: any, language: 'en' | 'ar'): string => {
  if (!error) return '';
  
  const message = error.message || error.toString();
  
  // Handle specific Supabase auth errors
  if (message.includes('User already registered')) {
    return language === 'ar' 
      ? 'هذا البريد الإلكتروني مسجل بالفعل'
      : 'This email is already registered';
  }
  
  if (message.includes('Invalid login credentials')) {
    return language === 'ar'
      ? 'بيانات تسجيل الدخول غير صحيحة'
      : 'Invalid login credentials';
  }
  
  if (message.includes('Email not confirmed')) {
    return language === 'ar'
      ? 'يرجى تأكيد بريدك الإلكتروني'
      : 'Please confirm your email address';
  }
  
  if (message.includes('Password should be at least 6 characters')) {
    return language === 'ar'
      ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'
      : 'Password should be at least 6 characters';
  }
  
  // Default error message
  return language === 'ar'
    ? 'حدث خطأ، يرجى المحاولة مرة أخرى'
    : 'An error occurred, please try again';
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
  },

  resendVerificationEmail: async (email: string, language: 'en' | 'ar') => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) throw error;
  },

  checkEmailVerification: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email_confirmed_at != null;
  }
};
