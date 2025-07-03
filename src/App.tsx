
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { AudioProvider } from '@/contexts/AudioContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import AppInitializer from '@/navigation/AppInitializer';
import MobileSplash from '@/components/MobileSplash';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <NetworkProvider>
            <AuthProvider>
              <AudioProvider>
                <BrowserRouter>
                  <MobileSplash>
                    <AppInitializer />
                  </MobileSplash>
                </BrowserRouter>
                <Toaster />
              </AudioProvider>
            </AuthProvider>
          </NetworkProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
