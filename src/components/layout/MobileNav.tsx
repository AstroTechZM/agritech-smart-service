import React from 'react';
import { Home, History, Menu, QrCode, Users, Shield, Sprout } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { UserRole } from '@/src/types';
import { NavLink } from 'react-router-dom';

interface MobileNavProps {
  role: UserRole;
  onMenuToggle: () => void;
}

export const MobileNav = ({ role, onMenuToggle }: MobileNavProps) => {
  const navConfig: Record<UserRole, any[]> = {
    [UserRole.FARMER]: [
      { id: 'production', icon: Sprout, label: 'Farm', path: '/production' },
      { id: 'deliveries', icon: History, label: 'Deliveries', path: '/deliveries' },
      { id: 'menu', icon: Menu, label: 'Menu' },
    ],
    [UserRole.AGRO_DEALER]: [
      { id: 'overview', icon: Home, label: 'Home', path: '/dashboard' },
      { id: 'scan', icon: QrCode, label: 'Scan', primary: true, path: '/vouchers' },
      { id: 'menu', icon: Menu, label: 'Menu' },
    ],
    [UserRole.AGENT]: [
      { id: 'overview', icon: Home, label: 'Home', path: '/dashboard' },
      { id: 'registration', icon: Users, label: 'Register', primary: true, path: '/registration' },
      { id: 'menu', icon: Menu, label: 'Menu' },
    ],
    [UserRole.ADMIN]: [
      { id: 'overview', icon: Home, label: 'Home', path: '/dashboard' },
      { id: 'security', icon: Shield, label: 'Security', primary: true, path: '/security' },
      { id: 'menu', icon: Menu, label: 'Menu' },
    ],
  };

  const items = navConfig[role] || navConfig[UserRole.FARMER];

  return (
    <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 bg-white/80 backdrop-blur-xl border border-black/5 rounded-3xl z-50 flex items-center justify-around px-6 shadow-2xl shadow-primary/10">
      {items.map((item) => {
        if (item.id === 'menu') {
          return (
            <button
              key={item.label}
              onClick={onMenuToggle}
              className="flex flex-col items-center gap-1 text-neutral-400 hover:text-primary transition-all"
            >
              <item.icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          );
        }

        return (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 transition-all",
              item.primary
                ? "bg-primary text-white p-3.5 rounded-2xl -translate-y-6 shadow-xl shadow-primary/20 scale-110"
                : isActive ? "text-primary" : "text-neutral-400 hover:text-primary/70"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={item.primary ? 22 : 20} className={cn(!item.primary && isActive && "scale-110 transition-transform")} />
                {!item.primary && <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
