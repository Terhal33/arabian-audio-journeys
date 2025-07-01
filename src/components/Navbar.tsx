
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useAppState } from '@/contexts/AppStateContext';

type NavigationDestination = 'index' | 'tours' | 'login' | 'signup' | 'admin-dashboard' | 'customer-dashboard' | 'profile';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, userRole, logout } = useAuth();
  const { navigateTo } = useAppState();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigateTo('index');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = (page: NavigationDestination) => {
    navigateTo(page);
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => handleNavigation('index')}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl font-display font-semibold text-desert-dark">
            <span className="text-gold">Terhal</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => handleNavigation('tours')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            All Tours
          </button>
          
          {!isAuthenticated ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleNavigation('login')}
              >
                Sign In
              </Button>
              <Button 
                className="bg-desert hover:bg-desert-dark" 
                onClick={() => handleNavigation('signup')}
              >
                Create Account
              </Button>
            </>
          ) : (
            <>
              {userRole === 'admin' ? (
                <button 
                  onClick={() => handleNavigation('admin-dashboard')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Admin Panel
                </button>
              ) : (
                <button 
                  onClick={() => handleNavigation('customer-dashboard')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </button>
              )}
              <button 
                onClick={() => handleNavigation('profile')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Profile
              </button>
              <Button variant="ghost" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 focus:outline-none"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-desert-dark" />
          ) : (
            <Menu className="h-6 w-6 text-desert-dark" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="bg-white px-4 py-2 md:hidden border-t border-gray-100">
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => handleNavigation('tours')}
              className="py-2 text-left text-muted-foreground hover:text-foreground"
            >
              All Tours
            </button>
            
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => handleNavigation('login')}
                  className="py-2 flex items-center text-desert-dark"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </button>
                <Button 
                  className="bg-desert hover:bg-desert-dark w-full"
                  onClick={() => handleNavigation('signup')}
                >
                  Create Account
                </Button>
              </>
            ) : (
              <>
                {userRole === 'admin' ? (
                  <button 
                    onClick={() => handleNavigation('admin-dashboard')}
                    className="py-2 text-left text-muted-foreground hover:text-foreground"
                  >
                    Admin Panel
                  </button>
                ) : (
                  <button 
                    onClick={() => handleNavigation('customer-dashboard')}
                    className="py-2 text-left text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </button>
                )}
                <button 
                  onClick={() => handleNavigation('profile')}
                  className="py-2 text-left text-muted-foreground hover:text-foreground"
                >
                  Profile
                </button>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="w-full justify-start pl-0"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
