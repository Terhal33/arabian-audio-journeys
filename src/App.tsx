
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Navigation
import AppInitializer from "@/navigation/AppInitializer";
import SupabaseConnectionTest from "@/components/SupabaseConnectionTest";

const App = () => (
  <>
    <Toaster />
    <Sonner />
    <AppInitializer />
    <SupabaseConnectionTest />
  </>
);

export default App;
