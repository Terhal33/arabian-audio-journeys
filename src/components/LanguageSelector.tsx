
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Flag } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useAuth();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className={language === 'en' ? 'bg-desert text-white' : ''}
      >
        <Flag className="mr-2 h-4 w-4" />
        English
      </Button>
      <Button
        variant={language === 'ar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('ar')}
        className={language === 'ar' ? 'bg-desert text-white font-arabic' : 'font-arabic'}
      >
        <Flag className="mr-2 h-4 w-4" />
        العربية
      </Button>
    </div>
  );
};

export default LanguageSelector;
