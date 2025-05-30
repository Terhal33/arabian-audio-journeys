
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

interface AppStateContextType {
  currentPage: string;
  navigateTo: (page: string, params?: any) => void;
  message: Message | null;
  showMessage: (text: string, type: 'success' | 'error' | 'info') => void;
  clearMessage: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('index');
  const [message, setMessage] = useState<Message | null>(null);

  const navigateTo = (page: string, params?: any) => {
    // Handle tour detail navigation
    if (page.startsWith('/tour/')) {
      const tourId = page.replace('/tour/', '');
      setCurrentPage(`tour/${tourId}`);
      return;
    }
    
    // Remove leading slash if present
    const cleanPage = page.startsWith('/') ? page.slice(1) : page;
    setCurrentPage(cleanPage);
  };

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage({ text, type });
    // Auto-clear message after 5 seconds
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const clearMessage = () => {
    setMessage(null);
  };

  const value = {
    currentPage,
    navigateTo,
    message,
    showMessage,
    clearMessage
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
