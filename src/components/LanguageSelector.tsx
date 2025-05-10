
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useAuth();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
      >
        English
      </Button>
      <Button
        variant={language === 'ar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('ar')}
      >
        العربية
      </Button>
    </div>
  );
};

export default LanguageSelector;
