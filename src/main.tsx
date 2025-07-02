
import { createRoot } from 'react-dom/client';
import { 
  QueryClient, 
  QueryClientProvider,
  QueryCache,
  MutationCache 
} from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth/AuthProvider";
import { AudioProvider } from "@/contexts/AudioContext";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import App from './App.tsx';
import './index.css';

// Create a client with better performance settings and error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Query error:', error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  }),
});

// Get root element with proper error handling
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Initialize the app with React 18's createRoot
createRoot(rootElement).render(
  <ErrorBoundary onError={(error, errorInfo) => {
    console.error('Application error:', error, errorInfo);
  }}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NetworkProvider>
          <AuthProvider>
            <AudioProvider>
              <App />
              <Toaster />
            </AudioProvider>
          </AuthProvider>
        </NetworkProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);
