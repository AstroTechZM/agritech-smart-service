import React from 'react';
import { createHashRouter, Navigate, Outlet } from 'react-router-dom';
import AppShell from '@/src/components/layout/AppShell';
import Login from '@/src/pages/auth/Login';
import Dashboard from '@/src/pages/dashboard/Dashboard';
import Vouchers from '@/src/pages/vouchers/Vouchers';
import Deliveries from '@/src/pages/deliveries/Deliveries';
import Stock from '@/src/pages/stock/Stock';
import Logistics from '@/src/pages/logistics/Logistics';
import Registration from '@/src/pages/registration/Registration';
import Payments from '@/src/pages/payments/Payments';
import Security from '@/src/pages/security/Security';
import FarmProduction from '@/src/pages/production/FarmProduction';
import Wallet from '@/src/pages/wallet/Wallet';
import Profile from '@/src/pages/profile/Profile';
import Settings from '@/src/pages/settings/Settings';
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
                element: <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.AGENT]} />,
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
