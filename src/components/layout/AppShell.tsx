import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { User, UserRole } from '@/src/types';

interface AppShellProps {
  user: User | null;
  onLogout: () => void;
  onRoleChange: (role: UserRole) => void;
}

export const AppShell = ({ user, onLogout, onRoleChange }: AppShellProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Determine active tab name for TopBar based on path
  const getActiveTab = (path: string) => {
    const segment = path.split('/')[1] || 'dashboard';
    return segment.charAt(0) + segment.slice(1);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-neutral-900 font-sans selection:bg-primary/10 selection:text-primary">
      <TopBar 
        user={user} 
        onMenuToggle={() => setIsSidebarOpen(true)} 
        activeTab={getActiveTab(location.pathname)} 
      />
      
      <Sidebar 
        role={user.role} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onLogout={onLogout} 
      />

      <main className="lg:ml-72 pt-20 pb-28 lg:pb-8 px-4 lg:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto py-8">
          <Outlet />
        </div>
      </main>

      <MobileNav 
        role={user.role} 
        onMenuToggle={() => setIsSidebarOpen(true)} 
      />
    </div>
  );
};

export default AppShell;
