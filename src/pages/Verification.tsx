
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const Verification = () => {
  const { language } = useAuth();
  
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
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <MailCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-display font-semibold mb-4">
            {language === 'ar' ? 'تحقق من بريدك الإلكتروني' : 'Check Your Email'}
          </h1>
          
          <p className="text-muted-foreground mb-6">
            {language === 'ar' 
              ? 'لقد أرسلنا رابط التحقق إلى بريدك الإلكتروني. يرجى النقر على الرابط لتأكيد حسابك' 
              : 'We have sent a verification link to your email address. Please click the link to confirm your account'}
          </p>
          
          <Button 
            asChild
            className="w-full bg-desert hover:bg-desert-dark text-white mb-4"
          >
            <Link to="/login">
              {language === 'ar' ? 'العودة إلى تسجيل الدخول' : 'Back to Sign In'}
            </Link>
          </Button>
          
          <p className="text-sm text-muted-foreground">
            {language === 'ar'
              ? 'لم تستلم البريد الإلكتروني؟ تحقق من مجلد الرسائل غير المرغوب فيها أو'
              : "Didn't receive the email? Check your spam folder or"}
            {' '}
            <Link to="/signup" className="text-oasis hover:underline">
              {language === 'ar' ? 'حاول مرة أخرى' : 'try again'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verification;
