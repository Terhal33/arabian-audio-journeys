
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useFormValidation } from '@/hooks/useFormValidation';
import LanguageSelector from '@/components/LanguageSelector';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword, language } = useAuth();
  
  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur, 
    validateForm,
    resetForm
  } = useFormValidation(
    { email: '' },
    {
      email: {
        required: true,
        email: true,
        message: language === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح' : 'Please enter a valid email'
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
      await resetPassword(values.email);
      setIsSuccess(true);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
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
            {language === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password'}
          </h1>
          
          <p className="text-muted-foreground text-center mb-6">
            {language === 'ar' 
              ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطا لإعادة تعيين كلمة المرور' 
              : 'Enter your email and we will send you a password reset link'}
          </p>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isSuccess && (
            <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                {language === 'ar' 
                  ? 'تم إرسال رابط إعادة تعيين كلمة المرور. يرجى التحقق من بريدك الإلكتروني' 
                  : 'Password reset link sent. Please check your email'}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
            
            <Button 
              type="submit" 
              className="w-full bg-desert hover:bg-desert-dark text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                language === 'ar' ? 'جاري الإرسال...' : 'Sending...'
              ) : (
                language === 'ar' ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link'
              )}
            </Button>
            
            <div className="text-center">
              <Link to="/login" className="text-oasis hover:underline text-sm">
                {language === 'ar' ? 'العودة إلى تسجيل الدخول' : 'Back to Login'}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
