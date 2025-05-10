
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

type User = {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Mock authentication check - this would use Supabase in the real implementation
        const storedUser = localStorage.getItem('aaj_user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth session check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock login - would use Supabase auth in real implementation
      if (email && password) {
        // For demo, create a mock user
        const mockUser = {
          id: 'user_' + Math.random().toString(36).substring(2, 11),
          email,
          name: email.split('@')[0],
          isPremium: false
        };
        
        setUser(mockUser);
        localStorage.setItem('aaj_user', JSON.stringify(mockUser));
        
        toast({
          title: "Signed in",
          description: "You have been successfully signed in.",
        });
      } else {
        throw new Error("Email and password are required");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Mock signup - would use Supabase auth in real implementation
      if (email && password && name) {
        // For demo, create a mock user
        const mockUser = {
          id: 'user_' + Math.random().toString(36).substring(2, 11),
          email,
          name,
          isPremium: false
        };
        
        setUser(mockUser);
        localStorage.setItem('aaj_user', JSON.stringify(mockUser));
        
        toast({
          title: "Account created",
          description: "Your account has been successfully created.",
        });
      } else {
        throw new Error("Email, password and name are required");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Mock logout - would use Supabase auth in real implementation
    localStorage.removeItem('aaj_user');
    setUser(null);
    
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
