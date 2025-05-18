
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";

// Navigation structure
import AppInitializer from "@/navigation/AppInitializer";
import AuthNavigator from "@/navigation/AuthNavigator";
import MainNavigator from "@/navigation/MainNavigator";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Splash from "./pages/Splash";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AudioProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppInitializer>
              <Routes>
                {/* Auth routes */}
                <Route path="/*" element={<AuthNavigator showOnboarding={!localStorage.getItem('aaj_onboarded')} />} />
                
                {/* Protected app routes */}
                <Route path="/home/*" element={
                  <ProtectedRoute>
                    <MainNavigator />
                  </ProtectedRoute>
                } />
                <Route path="/tours/*" element={
                  <ProtectedRoute>
                    <MainNavigator />
                  </ProtectedRoute>
                } />
                <Route path="/map/*" element={
                  <ProtectedRoute>
                    <MainNavigator />
                  </ProtectedRoute>
                } />
                <Route path="/search/*" element={
                  <ProtectedRoute>
                    <MainNavigator />
                  </ProtectedRoute>
                } />
                <Route path="/library/*" element={
                  <ProtectedRoute>
                    <MainNavigator />
                  </ProtectedRoute>
                } />
                <Route path="/profile/*" element={
                  <ProtectedRoute>
                    <MainNavigator />
                  </ProtectedRoute>
                } />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </AppInitializer>
          </BrowserRouter>
        </AudioProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
