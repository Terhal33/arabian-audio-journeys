
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useFormValidation } from '@/hooks/useFormValidation';
import LanguageSelector from '@/components/LanguageSelector';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signUp, language } = useAuth();
  
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
        minLength: 6,
        message: language === 'ar' ? 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل' : 'Password must be at least 6 characters'
      },
      confirmPassword: {
        required: true,
        match: 'password',
        message: language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'
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
      await signUp(values.email, values.password, values.fullName);
      navigate('/verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-sand-light ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-2xl font-display font-semibold text-desert-dark">
            Arabian<span className="text-gold">Audio</span>
          </Link>
          <LanguageSelector />
        </div>
        
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
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={touched.email && errors.email ? 'border-red-500' : ''}
              />
              {touched.email && errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={language === 'ar' ? '••••••••' : '••••••••'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={touched.password && errors.password ? 'border-red-500' : ''}
              />
              {touched.password && errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder={language === 'ar' ? '••••••••' : '••••••••'}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : ''}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-desert hover:bg-desert-dark text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                language === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...'
              ) : (
                language === 'ar' ? 'إنشاء حساب' : 'Create Account'
              )}
            </Button>
            
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
      </div>
    </div>
  );
};

export default Signup;
