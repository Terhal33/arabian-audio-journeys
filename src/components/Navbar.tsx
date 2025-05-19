
import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthProvider';

const Navbar = () => {
  // Use the auth context directly, with error handling
  let { user, isAuthenticated, logout } = { user: null, isAuthenticated: false, logout: () => Promise.resolve() };
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    user = auth.user;
    logout = auth.logout;
  } catch (e) {
    console.error("Navbar: Error accessing auth context:", e);
  }
  
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Skip navbar display on pages with bottom navigation
  const bottomNavPaths = ['/home', '/map', '/search', '/library', '/profile', '/tours', '/settings'];
  const shouldShowNavbar = !bottomNavPaths.some(path => 
    location.pathname === path || 
    (path === '/home' && location.pathname.startsWith('/tour/'))
  );

  const isActive = (path: string) => {
    // Consider sub-routes of profile like settings
    if (path === '/profile' && location.pathname === '/settings') {
      return true;
    }
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Logout is handled by AuthContext which will redirect appropriately
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // If we're on a login or signup page, or a page with bottom navigation, don't show the navbar at all
  if (['/login', '/signup', '/forgot-password', '/verification', '/onboarding'].some(path => 
      location.pathname.startsWith(path)) || !shouldShowNavbar) {
    return null;
  }

  // For debugging
  console.log('Navbar rendering. Current path:', location.pathname, 'isAuthenticated:', isAuthenticated, 'shouldShowNavbar:', shouldShowNavbar);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-display font-semibold text-desert-dark">
            Arabian<span className="text-gold">Audio</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {isAuthenticated && (
            <>
              <NavLink to="/tours" className={`nav-link ${isActive('/tours') ? 'text-foreground font-medium' : ''}`}>
                Tours
              </NavLink>
              <NavLink to="/subscription" className={`nav-link ${isActive('/subscription') ? 'text-foreground font-medium' : ''}`}>
                Subscription
              </NavLink>
              <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                Sign Out
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button - only show if authenticated */}
        {isAuthenticated && (
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-desert-dark" />
            ) : (
              <Menu className="h-6 w-6 text-desert-dark" />
            )}
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      {menuOpen && isAuthenticated && (
        <nav className="bg-white px-4 py-2 md:hidden border-t border-gray-100">
          <div className="flex flex-col space-y-3">
            <NavLink 
              to="/tours" 
              className={`py-2 ${isActive('/tours') ? 'text-desert-dark font-medium' : 'text-muted-foreground'}`}
              onClick={() => setMenuOpen(false)}
            >
              Tours
            </NavLink>
            <NavLink 
              to="/subscription" 
              className={`py-2 ${isActive('/subscription') ? 'text-desert-dark font-medium' : 'text-muted-foreground'}`}
              onClick={() => setMenuOpen(false)}
            >
              Subscription
            </NavLink>
            <Button 
              variant="ghost" 
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }} 
              className="text-muted-foreground hover:text-foreground justify-start pl-0"
            >
              Sign Out
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
