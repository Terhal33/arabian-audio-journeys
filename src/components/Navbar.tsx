
import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
          <NavLink to="/" className={`nav-link ${isActive('/') ? 'text-foreground font-medium' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/tours" className={`nav-link ${isActive('/tours') ? 'text-foreground font-medium' : ''}`}>
            Tours
          </NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className={`nav-link ${isActive('/profile') ? 'text-foreground font-medium' : ''}`}>
                Profile
              </NavLink>
              <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-foreground">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={`nav-link ${isActive('/login') ? 'text-foreground font-medium' : ''}`}>
                Sign In
              </NavLink>
              <Button asChild className="bg-desert hover:bg-desert-dark text-white">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
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
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="bg-white px-4 py-2 md:hidden border-t border-gray-100">
          <div className="flex flex-col space-y-3">
            <NavLink 
              to="/" 
              className={`py-2 ${isActive('/') ? 'text-desert-dark font-medium' : 'text-muted-foreground'}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/tours" 
              className={`py-2 ${isActive('/tours') ? 'text-desert-dark font-medium' : 'text-muted-foreground'}`}
              onClick={() => setMenuOpen(false)}
            >
              Tours
            </NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/profile" 
                  className={`py-2 ${isActive('/profile') ? 'text-desert-dark font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }} 
                  className="text-muted-foreground hover:text-foreground justify-start pl-0"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={`py-2 ${isActive('/login') ? 'text-desert-dark font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="py-2 text-desert-dark font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
