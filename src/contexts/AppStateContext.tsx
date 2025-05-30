
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppStateContextType {
  currentPage: string;
  navigateTo: (page: string, params?: any) => void;
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

  const value = {
    currentPage,
    navigateTo
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
