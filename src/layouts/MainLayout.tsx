
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Map, Search, Library, User } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: Home, label: 'Discover' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    // Consider /tour/:id and other sub-routes to be part of their parent sections
    if (path === '/home' && location.pathname.startsWith('/tour/')) {
      return true;
    }
    return location.pathname === path || 
      (path === '/home' && location.pathname === '/');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-16">
        {children}
      </div>

      {/* Bottom navigation */}
      <nav className="bg-white border-t border-gray-200 h-16 fixed bottom-0 w-full z-50 shadow-md">
        <div className="flex h-full">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center justify-center text-xs ${
                  isActive
                    ? 'text-desert-dark'
                    : 'text-muted-foreground'
                }`
              }
            >
              <Icon
                className={`h-6 w-6 mb-1 ${
                  isActive(path) ? 'text-desert-dark' : 'text-muted-foreground'
                }`}
              />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
