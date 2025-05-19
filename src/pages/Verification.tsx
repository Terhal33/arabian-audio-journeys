
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { MailCheck, AlertCircle, RefreshCw, Mail, Edit } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const Verification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, user } = useAuth();
  const { toast } = useToast();
  
  // Get email from state or use user email as fallback
  const email = location.state?.email || user?.email || '';
  
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Start with 60 seconds countdown if email was just sent
    if (location.state?.emailJustSent) {
      setResendCountdown(60);
    }
    
    return () => {
      // Clear interval on unmount
      if (countdownIntervalRef.current) {
        window.clearInterval(countdownIntervalRef.current);
      }
    };
  }, [location.state]);
  
  useEffect(() => {
    // Set up countdown interval
    if (resendCountdown > 0) {
      countdownIntervalRef.current = window.setInterval(() => {
        setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    return () => {
      if (countdownIntervalRef.current) {
        window.clearInterval(countdownIntervalRef.current);
      }
    };
  }, [resendCountdown]);
  
  const handleResendEmail = async () => {
    if (resendCountdown > 0 || !email) return;
    
    setIsResending(true);
    setError(null);
    
    try {
      // This would call your auth provider's resend verification method
      // await resendVerificationEmail(email);
      
      // For demo, we'll simulate success
      toast({
        title: language === 'ar' ? 'تم إرسال البريد الإلكتروني' : 'Email sent',
        description: language === 'ar' 
          ? 'تم إرسال رابط التحقق مرة أخرى' 
          : 'Verification link has been resent',
      });
      
      setResendCountdown(60); // Start 60 second countdown
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };
  
  const handleVerificationCheck = () => {
    // You would typically check with your auth provider if email is verified
    // For demo purposes, we'll just navigate to login
    toast({
      title: language === 'ar' ? 'جاري التحقق' : 'Checking verification',
      description: language === 'ar' 
        ? 'جاري التحقق من حالة البريد الإلكتروني الخاص بك' 
        : 'Checking your email verification status',
    });
    
    setTimeout(() => {
      // Simulating successful verification
      navigate('/login', { 
        state: { 
          verificationSuccess: true 
        }
      });
    }, 1500);
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
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <MailCheck className="h-10 w-10 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-display font-semibold mb-4">
            {language === 'ar' ? 'تحقق من بريدك الإلكتروني' : 'Check Your Email'}
          </h1>
          
          <p className="text-muted-foreground mb-2">
            {language === 'ar' 
              ? 'لقد أرسلنا رابط التحقق إلى' 
              : 'We have sent a verification link to'}
          </p>
          
          <p className="font-medium text-lg mb-6 break-all">
            {email || 'your email address'}
          </p>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-desert hover:bg-desert-dark text-white"
              onClick={handleVerificationCheck}
            >
              <Mail className="mr-2 h-4 w-4" />
              {language === 'ar' ? 'لقد قمت بالتحقق بالفعل' : 'I\'ve Verified My Email'}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={resendCountdown > 0 || isResending}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
              {resendCountdown > 0 
                ? (language === 'ar' 
                    ? `إعادة الإرسال (${resendCountdown})` 
                    : `Resend Email (${resendCountdown})`)
                : (language === 'ar' 
                    ? 'إعادة إرسال رابط التحقق' 
                    : 'Resend Verification Link')}
            </Button>
            
            <Button
              variant="ghost"
              className="w-full text-oasis"
              asChild
            >
              <Link to="/signup">
                <Edit className="mr-2 h-4 w-4" />
                {language === 'ar' ? 'تغيير البريد الإلكتروني' : 'Change Email Address'}
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            {language === 'ar'
              ? 'تحقق من مجلد البريد العشوائي إذا لم تجد البريد الإلكتروني في صندوق الوارد'
              : 'Check your spam folder if you don\'t see the email in your inbox'}
          </p>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link to="/login" className="text-oasis hover:underline text-sm">
              {language === 'ar' ? 'العودة إلى تسجيل الدخول' : 'Back to Sign In'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
