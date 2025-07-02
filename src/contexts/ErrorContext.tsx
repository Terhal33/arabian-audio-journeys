
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorContextType {
  reportError: (error: Error, context?: string) => void;
  clearErrors: () => void;
  errors: Array<{ error: Error; context?: string; timestamp: number }>;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<Array<{ error: Error; context?: string; timestamp: number }>>([]);
  const { toast } = useToast();

  const reportError = (error: Error, context?: string) => {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    
    setErrors(prev => [...prev, { error, context, timestamp: Date.now() }]);
    
    toast({
      title: "An error occurred",
      description: error.message || "Something went wrong. Please try again.",
      variant: "destructive",
    });
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider value={{ reportError, clearErrors, errors }}>
      {children}
    </ErrorContext.Provider>
  );
}

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
