
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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
import App from './App.tsx';
import './index.css';

// Create a client with better performance settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      suspense: false,
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

// Initialize the app with React 18's createRoot
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
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
    </BrowserRouter>
  </QueryClientProvider>
);
