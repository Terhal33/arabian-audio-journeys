
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthProvider';
import LanguageSelector from '@/components/LanguageSelector';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  const { signUp, language } = useAuth();

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
        
        <RegisterForm language={language as 'en' | 'ar'} signUp={signUp} />
      </div>
    </div>
  );
};

export default Register;
