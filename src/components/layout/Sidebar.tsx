import React from 'react';
import {
  LayoutDashboard,
  Users,
  Ticket,
  Package,
  Truck,
  Shield,
  Settings,
  LogOut,
  EyeOff,
  Wallet,
  User as UserIcon,
  Sprout,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { UserRole } from '@/src/types';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const Sidebar = ({ role, isOpen, onClose, onLogout }: SidebarProps) => {
  const allMenuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'vouchers', label: 'Vouchers', icon: Ticket, path: '/vouchers' },
    { id: 'redemption', label: 'Redemption', icon: QrCode, path: '/redemption' },
    { id: 'deliveries', label: 'Deliveries', icon: History, path: '/deliveries' },
    { id: 'stock', label: 'Stock', icon: Package, path: '/stock' },
    { id: 'registration', label: 'Registration', icon: Users, path: '/registration' },
    { id: 'logistics', label: 'Logistics', icon: Truck, path: '/logistics' },
    { id: 'payments', label: 'Payments', icon: Wallet, path: '/payments' },
    { id: 'wallet', label: 'My Wallet', icon: Wallet, path: '/wallet' },
    { id: 'security', label: 'Security', icon: Shield, path: '/security' },
    { id: 'production', label: 'My Farm', icon: Sprout, path: '/production' },
  ];

  const MENU_PERMISSIONS: Record<UserRole, string[]> = {
    [UserRole.FARMER]: ['overview', 'vouchers', 'deliveries', 'production', 'wallet'],
    [UserRole.AGRO_DEALER]: ['overview', 'redemption', 'stock'],
    [UserRole.AGENT]: ['overview', 'redemption', 'stock', 'logistics', 'registration'],
    [UserRole.ADMIN]: ['overview', 'vouchers', 'redemption', 'stock', 'registration', 'logistics', 'payments', 'security'],
  };

  const menuItems = allMenuItems.filter(item => MENU_PERMISSIONS[role].includes(item.id));

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "flex flex-col w-72 h-screen fixed left-0 top-0 bg-surface-container-low border-r border-black/5 z-[70] transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Package size={24} />
            </div>
            <div>
              <p className="text-lg font-black text-primary font-headline leading-tight">AgriTech</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Smart Service</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-neutral-500 hover:bg-black/5 rounded-full">
            <EyeOff size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Main Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-headline font-bold text-sm transition-all relative group",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-neutral-600 hover:bg-primary/5 hover:text-primary"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={cn(
                    "transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-neutral-400 group-hover:text-primary"
                  )} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveTab"
                      className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-black/5 space-y-4">
          <div className="bg-surface-container-high/50 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-neutral-500 uppercase mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-medium">Network Online</span>
            </div>
          </div>
          <div className="space-y-1">
            <NavLink 
              to="/profile"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors rounded-xl",
                isActive ? "text-primary bg-primary/10" : "text-neutral-500 hover:text-primary hover:bg-primary/5"
              )}
            >
              <UserIcon size={18} />
              Profile
            </NavLink>
            <NavLink 
              to="/settings"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors rounded-xl",
                isActive ? "text-primary bg-primary/10" : "text-neutral-500 hover:text-primary hover:bg-primary/5"
              )}
            >
              <Settings size={18} />
              Settings
            </NavLink>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 text-neutral-500 px-4 py-2.5 text-sm font-bold hover:text-error transition-colors rounded-xl hover:bg-error/5"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// Simple component for History which was used in mock data but icon not defined in sidebar
const History = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

export default Sidebar;
