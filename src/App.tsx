
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { AppStateProvider } from '@/contexts/AppStateContext';
import MainApp from '@/components/MainApp';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppStateProvider>
            <MainApp />
            <Toaster />
            <SonnerToaster />
          </AppStateProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
