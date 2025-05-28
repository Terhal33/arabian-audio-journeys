
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppInitializer from '@/navigation/AppInitializer';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppInitializer />
          <Toaster />
          <SonnerToaster />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
