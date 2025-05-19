
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { toast } from '@/hooks/use-toast';

/**
 * Create a user profile in Supabase if it doesn't exist
 */
export const createUserProfile = async (userId: string, userName: string, email: string | undefined, preferredLanguage: 'en' | 'ar') => {
  try {
    // Define the new profile with required id field
    const newProfile = {
      id: userId,
      full_name: userName,
      username: email,
      preferred_language: preferredLanguage,
      avatar_url: null
    };

    // Try the insert, but don't fail if it doesn't work (profile might already exist)
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error) {
      console.log('Error creating profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
};

/**
 * Fetch user profile from Supabase
 */
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

/**
 * Helper to get user-friendly error message from Supabase error codes
 */
export const getUserFriendlyErrorMessage = (error: any, language: 'en' | 'ar') => {
  // Common Supabase error codes
  const errorMap: Record<string, { en: string; ar: string }> = {
    'auth/email-already-in-use': {
      en: 'This email is already registered. Please sign in or use a different email.',
      ar: 'البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد إلكتروني آخر.'
    },
    'auth/invalid-email': {
      en: 'The email address is not valid.',
      ar: 'البريد الإلكتروني غير صالح.'
    },
    'auth/weak-password': {
      en: 'The password is too weak. Please choose a stronger password.',
      ar: 'كلمة المرور ضعيفة. يرجى اختيار كلمة مرور أقوى.'
    },
    'auth/user-not-found': {
      en: 'No account found with this email address.',
      ar: 'لم يتم العثور على حساب بهذا البريد الإلكتروني.'
    },
    'auth/wrong-password': {
      en: 'Incorrect password. Please try again.',
      ar: 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.'
    },
    '23505': {
      en: 'This email is already registered. Please sign in or use a different email.',
      ar: 'البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد إلكتروني آخر.'
    }
  };

  // Check if we have a specific error code
  const errorCode = error?.code || '';
  const message = errorMap[errorCode];
  
  if (message) {
    return language === 'ar' ? message.ar : message.en;
  }
  
  // Handle specific Supabase error messages
  if (error?.message?.includes('duplicate key')) {
    return language === 'ar' 
      ? 'البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد إلكتروني آخر.' 
      : 'This email is already registered. Please sign in or use a different email.';
  }

  // Default error message
  return error instanceof Error 
    ? error.message 
    : (language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
};

/**
 * Authentication methods
 */
export const authMethods = {
  signUp: async (email: string, password: string, fullName: string, language: 'en' | 'ar') => {
    try {
      console.log('Attempting signup with:', { email, fullName });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            preferred_language: language
          },
          emailRedirectTo: `${window.location.origin}/verification`
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }
      
      if (data?.user) {
        console.log('Signup successful, user:', data.user);
        
        // Return data to allow caller to use the email for redirect
        return {
          user: data.user,
          email: email,
          emailJustSent: true
        };
      } else {
        throw new Error(language === 'ar' 
          ? 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.' 
          : 'Account creation failed. Please try again.');
      }
    } catch (error) {
      // Get user-friendly message based on error code
      const message = getUserFriendlyErrorMessage(error, language);
      
      console.error('Error in signUp method:', error);
      
      toast({
        variant: "destructive",
        title: language === 'ar' ? "خطأ في إنشاء الحساب" : "Error creating account",
        description: message
      });
      
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
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
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Remove any stored authentication data or tokens
      localStorage.removeItem('redirectAfterLogin');
      
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
      throw error;
    }
  },

  resetPassword: async (email: string) => {
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
  },

  updateProfile: async (updates: Partial<UserProfile>, userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      
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
  },
  
  resendVerificationEmail: async (email: string, language: 'en' | 'ar') => {
    try {
      // First, check if the user exists and is verified
      const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/verification`
        }
      });
      
      if (signInError) throw signInError;
      
      toast({
        title: language === 'ar' ? "تم إرسال البريد الإلكتروني" : "Email sent",
        description: language === 'ar' 
          ? "تم إعادة إرسال رابط التحقق. يرجى التحقق من بريدك الإلكتروني." 
          : "Verification link has been resent. Please check your email.",
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: language === 'ar' ? "فشل في إرسال البريد الإلكتروني" : "Email sending failed",
        description: getUserFriendlyErrorMessage(error, language)
      });
      throw error;
    }
  },
  
  checkEmailVerification: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      // Check if email is confirmed in user metadata
      return data?.user?.email_confirmed_at ? true : false;
      
    } catch (error) {
      console.error('Error checking email verification:', error);
      return false;
    }
  }
};

