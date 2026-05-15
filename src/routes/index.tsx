import React from 'react';
import { createHashRouter, Navigate, Outlet } from 'react-router-dom';
import AppShell from '@/src/components/layout/AppShell';

// Shared Pages
import Login from '@/src/pages/shared/auth/Login';
import Dashboard from '@/src/pages/shared/dashboard/Dashboard';
import Profile from '@/src/pages/shared/profile/Profile';
import Settings from '@/src/pages/shared/settings/Settings';
import Security from '@/src/pages/shared/security/Security';

// Farmer Pages
import Vouchers from '@/src/pages/farmer/vouchers/Vouchers';
import Deliveries from '@/src/pages/farmer/deliveries/Deliveries';
import FarmProduction from '@/src/pages/farmer/production/FarmProduction';
import Wallet from '@/src/pages/farmer/wallet/Wallet';

// Agent / Field Officer Pages
import Registration from '@/src/pages/agent/registration/Registration';
import RedemptionPortal from '@/src/pages/agent/redemption/RedemptionPortal';
import Stock from '@/src/pages/agent/stock/Stock';

// Admin Pages
import Payments from '@/src/pages/admin/payments/Payments';
import Logistics from '@/src/pages/admin/logistics/Logistics';

import { User, UserRole } from '@/src/types';

interface ProtectedRouteProps {
  user: User | null;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ user, allowedRoles }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

interface RouterProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onRoleChange: (role: UserRole) => void;
  onProfileSave: (updates: Partial<User>) => void;
}

export const createAppRouter = ({ user, onLogin, onLogout, onRoleChange, onProfileSave }: RouterProps) => {
  return createHashRouter([
    {
      path: '/login',
      element: user ? <Navigate to="/dashboard" replace /> : <Login onLogin={onLogin} />,
    },
    {
      path: '/registration',
      element: <Registration />,
    },
    {
      path: '/',
      element: <AppShell user={user} onLogout={onLogout} onRoleChange={onRoleChange} />,
      children: [
        {
          element: <ProtectedRoute user={user} />,
          children: [
            {
              index: true,
              element: <Navigate to="/dashboard" replace />,
            },
            {
              path: 'dashboard',
              element: <Dashboard user={user} />,
            },
            {
              path: 'vouchers',
              element: <Vouchers role={user?.role || UserRole.FARMER} />,
            },
            {
              path: 'redemption',
              element: <RedemptionPortal />,
            },
            {
                path: 'deliveries',
                element: <Deliveries />,
            },
            {
              path: 'stock',
              element: <Stock role={user?.role || UserRole.FARMER} />,
            },
            {
              path: 'logistics',
              element: <Logistics role={user?.role || UserRole.FARMER} />,
            },
            {
              path: 'profile',
              element: <Profile user={user!} onLogout={onLogout} onSave={onProfileSave} />,
            },
            {
              path: 'settings',
              element: <Settings />,
            },
            // Role specific routes
            {
              element: <ProtectedRoute user={user} allowedRoles={[UserRole.FARMER]} />,
              children: [
                {
                  path: 'wallet',
                  element: <Wallet user={user!} />,
                },
                {
                    path: 'production',
                    element: <FarmProduction />,
                },
              ]
            },
            {
                element: <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.AGENT, UserRole.AGRO_DEALER]} />,
                children: [
                  {
                    path: 'payments',
                    element: <Payments />,
                  },
                  {
                    path: 'security',
                    element: <Security />,
                  },
                ]
            }
          ]
        }
      ],
    },
    {
      path: '*',
      element: <Navigate to="/dashboard" replace />,
    },
  ]);
};

export default createAppRouter;
