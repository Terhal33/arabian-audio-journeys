
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff, Apple, Mail } from 'lucide-react';
import { useFormValidation } from '@/hooks/useFormValidation';
import PasswordStrength from './PasswordStrength';

interface RegisterFormProps {
  language: 'en' | 'ar';
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
}

const RegisterForm = ({ language, signUp }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur, 
    validateForm 
  } = useFormValidation(
    { fullName: '', email: '', password: '', confirmPassword: '' },
    {
      fullName: {
        required: true,
        message: language === 'ar' ? 'الاسم الكامل مطلوب' : 'Full name is required'
      },
      email: {
        required: true,
        email: true,
        message: language === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email'
      },
      password: {
        required: true,
        minLength: 8,
        message: language === 'ar' ? 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل' : 'Password must be at least 8 characters'
      },
      confirmPassword: {
        required: true,
        match: 'password',
        message: language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'
      }
    }
  );

  // Calculate password strength whenever password changes
  useEffect(() => {
    const password = values.password;
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check (max 25%)
    strength += Math.min(password.length * 3, 25);
    
    // Contains lowercase (15%)
    if (/[a-z]/.test(password)) strength += 15;
    
    // Contains uppercase (15%)
    if (/[A-Z]/.test(password)) strength += 15;
    
    // Contains numbers (15%)
    if (/[0-9]/.test(password)) strength += 15;
    
    // Contains special characters (30%)
    if (/[^a-zA-Z0-9]/.test(password)) strength += 30;
    
    setPasswordStrength(Math.min(strength, 100));
  }, [values.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    
    if (!acceptedTerms) {
      setError(language === 'ar' ? 'يجب الموافقة على الشروط والأحكام' : 'You must accept the terms and conditions');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(values.email, values.password, values.fullName);
      navigate('/verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      // This would be implemented when connecting to Supabase
      console.log('Google sign up clicked');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    try {
      setIsLoading(true);
      // This would be implemented when connecting to Supabase
      console.log('Apple sign up clicked');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Apple');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h1 className="text-2xl font-display font-semibold text-center mb-6">
        {language === 'ar' ? 'إنشاء حساب' : 'Create Account'}
      </h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="space-y-2">
          <Label htmlFor="fullName">
            {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={touched.fullName && errors.fullName ? 'border-red-500' : ''}
          />
          {touched.fullName && errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">
            {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
          </Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`${touched.email && errors.email ? 'border-red-500' : ''} pl-10`}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {touched.email && errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">
            {language === 'ar' ? 'كلمة المرور' : 'Password'}
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={language === 'ar' ? '••••••••' : '••••••••'}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={touched.password && errors.password ? 'border-red-500' : ''}
            />
            <button 
              type="button" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 
                <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                <Eye className="h-4 w-4 text-muted-foreground" />
              }
            </button>
          </div>
          
          {/* Password strength indicator */}
          {values.password && (
            <PasswordStrength 
              password={values.password} 
              language={language}
              passwordStrength={passwordStrength}
            />
          )}
          
          {touched.password && errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={language === 'ar' ? '••••••••' : '••••••••'}
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : ''}
            />
            <button 
              type="button" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 
                <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                <Eye className="h-4 w-4 text-muted-foreground" />
              }
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {language === 'ar' 
                ? 'أوافق على الشروط والأحكام وسياسة الخصوصية' 
                : 'I agree to the Terms of Service and Privacy Policy'}
            </label>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-desert hover:bg-desert-dark text-white" 
          disabled={isLoading || !acceptedTerms}
        >
          {isLoading ? (
            language === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...'
          ) : (
            language === 'ar' ? 'إنشاء حساب' : 'Create Account'
          )}
        </Button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              {language === 'ar' ? 'أو التسجيل باستخدام' : 'or sign up with'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAppleSignUp}
            disabled={isLoading}
          >
            <Apple className="mr-2 h-4 w-4" />
            Apple
          </Button>
        </div>
        
        <Separator />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
            {' '}
            <Link to="/login" className="text-oasis hover:underline">
              {language === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
