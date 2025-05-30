
import React from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const GlobalMessage: React.FC = () => {
  const { message, clearMessage } = useAppState();

  if (!message) return null;

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    return message.type === 'error' ? 'destructive' : 'default';
  };

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Alert variant={getVariant()} className="shadow-lg">
        {getIcon()}
        <AlertDescription className="flex items-center justify-between">
          <span>{message.text}</span>
          <button
            onClick={clearMessage}
            className="ml-2 hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GlobalMessage;
