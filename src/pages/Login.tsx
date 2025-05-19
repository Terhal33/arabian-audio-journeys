
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff, Apple, Mail } from 'lucide-react';
import { useFormValidation } from '@/hooks/useFormValidation';
import LanguageSelector from '@/components/LanguageSelector';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn, language } = useAuth();
  
  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur, 
    validateForm 
  } = useFormValidation(
    { email: '', password: '' },
    {
      email: {
        required: true,
        email: true,
        message: language === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email'
      },
      password: {
        required: true,
        message: language === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required'
      }
    }
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn(values.email, values.password);
      navigate('/tours');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // This would be implemented when connecting to Supabase
      console.log('Google sign in clicked');
      // await supabase.auth.signInWithOAuth({ provider: 'google' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      // This would be implemented when connecting to Supabase
      console.log('Apple sign in clicked');
      // await supabase.auth.signInWithOAuth({ provider: 'apple' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Apple');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`min-h-screen bg-sand-light ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex flex-col items-center">
            <div className="text-2xl font-display font-semibold text-desert-dark">
              Arabian<span className="text-gold">Audio</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {language === 'ar' ? 'استكشف المملكة العربية السعودية' : 'Explore Saudi Arabia'}
            </div>
          </Link>
          <LanguageSelector />
        </div>
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-display font-semibold text-center mb-6">
            {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </h1>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'ar' ? 'البريد الإلكتروني أو رقم الهاتف' : 'Email or Phone'}
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني أو رقم هاتفك' : 'Enter your email or phone number'}
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
              <div className="flex justify-between">
                <Label htmlFor="password">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </Label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-oasis hover:underline"
                >
                  {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>
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
                  onClick={toggleShowPassword}
                >
                  {showPassword ? 
                    <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  }
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-desert hover:bg-desert-dark text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                language === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...'
              ) : (
                language === 'ar' ? 'تسجيل الدخول' : 'Sign In'
              )}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  {language === 'ar' ? 'أو تسجيل الدخول باستخدام' : 'or sign in with'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
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
                onClick={handleAppleSignIn}
                disabled={isLoading}
              >
                <Apple className="mr-2 h-4 w-4" />
                Apple
              </Button>
            </div>
            
            <Separator />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}
                {' '}
                <Link to="/signup" className="text-oasis hover:underline">
                  {language === 'ar' ? 'إنشاء حساب' : 'Create an account'}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
