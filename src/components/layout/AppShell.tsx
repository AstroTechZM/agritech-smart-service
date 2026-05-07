/**
 * REACT BEGINNER'S GUIDE:
 * 
 * 1. THE "SHELL" OR "LAYOUT" PATTERN:
 *    - An AppShell is like the "Frame" of a picture. 
 *    - The TopBar, Sidebar, and Navigation stay the same, while the content in the middle changes.
 */
import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom'; // Routing tools
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { User, UserRole } from '@/src/types'; // Data types

interface AppShellProps {
  user: User | null;
  onLogout: () => void;
  onRoleChange: (role: UserRole) => void;
}

/**
 * 2. COMPONENT: AppShell
 *    This component wraps the entire application once a user is logged in.
 */
export const AppShell = ({ user, onLogout, onRoleChange }: AppShellProps) => {
  // 3. SIDEBAR STATE: Tracks if the mobile sidebar is currently slid out.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 4. ROUTER HOOKS: 'useLocation' tells us which URL (page) the user is currently on.
  const location = useLocation();

  /**
   * 5. AUTHENTICATION GUARD:
   *    - If there is no 'user', we use <Navigate /> to kick them back to the login page.
   *    - This is how we protect our private pages from unauthorized visitors.
   */
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Helper logic to find the name of the current page (e.g., "/stock" -> "Stock")
  const getActiveTab = (path: string) => {
    const segment = path.split('/')[1] || 'dashboard';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-neutral-900 font-sans selection:bg-primary/10 selection:text-primary">
      
      {/* 6. PASSING PROPS: We pass data and functions down to child components. */}
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
          {/**
           * 7. OUTLET:
           *    - This is a special React Router component.
           *    - It acts as a "Placeholder" where the current page's content will be injected.
           *    - For example, if the URL is /stock, the <Stock /> component appears here.
           */}
          <Outlet />
        </div>
      </main>

      {/* Navigation for mobile users at the bottom of the screen */}
      <MobileNav 
        role={user.role} 
        onMenuToggle={() => setIsSidebarOpen(true)} 
      />
    </div>
  );
};

export default AppShell;
