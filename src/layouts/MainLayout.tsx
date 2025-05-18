
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Map, Search, Library, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Add debug log
  console.log("MainLayout - Current path:", location.pathname);
  
  const navItems = [
    { path: '/home', icon: Home, label: 'Discover' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/library', icon: Library, label: 'Library' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    // Check if path is active (exact match or specific subpath relations)
    if (location.pathname === path) return true;
    
    // Consider /tour/:id routes to be part of home
    if (path === '/home' && location.pathname.startsWith('/tour/')) return true;
    
    // Consider settings to be part of profile
    if (path === '/profile' && location.pathname === '/settings') return true;
    
    return false;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-16">
        {children}
      </div>

      {/* Bottom navigation */}
      <nav className="bg-white border-t border-gray-200 h-16 fixed bottom-0 w-full z-40 shadow-lg">
        <div className="flex h-full max-w-screen-lg mx-auto">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            
            return (
              <NavLink
                key={path}
                to={path}
                className="flex flex-1 flex-col items-center justify-center relative"
              >
                {active && (
                  <div className="absolute -top-0 left-1/2 w-12 h-1 bg-desert rounded-b-full transform -translate-x-1/2"></div>
                )}
                <div className={cn(
                  "flex flex-col items-center justify-center",
                  active ? "text-desert-dark" : "text-muted-foreground"
                )}>
                  <Icon className={cn(
                    "h-6 w-6 mb-1 transition-colors",
                    active ? "text-desert-dark" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-xs transition-colors",
                    active ? "font-medium" : ""
                  )}>{label}</span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
