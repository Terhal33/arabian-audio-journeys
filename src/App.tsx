
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

// Auth check function
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// App Routes component
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const hasSeenOnboarding = localStorage.getItem('aaj_onboarded') === 'true';
  
  // Show splash screen while loading
  if (isLoading) {
    return <Splash />;
  }
  
  return (
    <Routes>
      {/* Root path decides where to redirect based on auth status */}
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to="/home" replace />
        ) : (
          <Navigate to={hasSeenOnboarding ? "/login" : "/onboarding"} replace />
        )
      } />
      
      {/* Auth routes - accessible when logged out */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/home" replace /> : <AuthNavigator showOnboarding={!hasSeenOnboarding} />
      } />
      <Route path="/signup" element={<AuthNavigator showOnboarding={!hasSeenOnboarding} />} />
      <Route path="/forgot-password" element={<AuthNavigator showOnboarding={!hasSeenOnboarding} />} />
      <Route path="/verification" element={<AuthNavigator showOnboarding={!hasSeenOnboarding} />} />
      <Route path="/onboarding" element={<AuthNavigator showOnboarding={true} />} />
      
      {/* Protected routes - require authentication */}
      <Route path="/home" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/map" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/library" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/tours" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      <Route path="/tour/:id" element={
        <ProtectedRoute>
          <MainNavigator />
        </ProtectedRoute>
      } />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AudioProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppInitializer>
              <AppRoutes />
            </AppInitializer>
          </BrowserRouter>
        </AudioProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
