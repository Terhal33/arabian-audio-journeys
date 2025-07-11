
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  BarChart3, 
  Settings,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import AdminTours from '@/components/admin/AdminTours';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminOverview from '@/components/admin/AdminOverview';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes('tours')) return 'admin-tours';
    if (path.includes('users')) return 'admin-users';
    return 'admin-overview';
  };

  const currentPage = getCurrentPage();

  const renderContent = () => {
    switch (currentPage) {
      case 'admin-tours':
        return <AdminTours />;
      case 'admin-users':
        return <AdminUsers />;
      case 'admin-overview':
        return <AdminOverview />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-sand-light">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar currentPage={currentPage} navigate={navigate} />
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

interface AdminSidebarProps {
  currentPage: string;
  navigate: (path: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPage, navigate }) => {
  const menuItems = [
    {
      id: 'admin-overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Dashboard analytics',
      path: '/admin'
    },
    {
      id: 'admin-tours',
      label: 'Manage Tours',
      icon: MapPin,
      description: 'Tour management',
      path: '/admin/tours'
    },
    {
      id: 'admin-users',
      label: 'Manage Users',
      icon: Users,
      description: 'User management',
      path: '/admin/users'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6 border-b">
        <h2 className="text-xl font-display font-semibold text-desert-dark">
          Admin Panel
        </h2>
        <p className="text-sm text-muted-foreground">
          Content management system
        </p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (currentPage === 'admin-dashboard' && item.id === 'admin-overview');
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-desert text-white' 
                      : 'text-muted-foreground hover:bg-sand-light hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
