
import React, { createContext, useContext, useState, ReactNode } from 'react';

type PageType = 'index' | 'tours' | 'login' | 'signup' | 'customer-dashboard' | 'admin-dashboard' | 'profile' | 'admin-tours' | 'admin-users' | 'admin-overview';

interface AppStateContextType {
  currentPage: PageType;
  navigateTo: (page: PageType) => void;
  showMessage: (message: string, type: 'success' | 'error' | 'info') => void;
  message: { text: string; type: 'success' | 'error' | 'info' } | null;
  clearMessage: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>('index');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
  };

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    // Auto-clear message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  const clearMessage = () => {
    setMessage(null);
  };

  return (
    <AppStateContext.Provider value={{
      currentPage,
      navigateTo,
      showMessage,
      message,
      clearMessage
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
