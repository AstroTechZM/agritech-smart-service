import React from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
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

interface RouterProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  onRoleChange: (role: UserRole) => void;
}

export const createAppRouter = ({ user, onLogin, onLogout, onRoleChange }: RouterProps) => {
  return createHashRouter([
    {
      path: '/login',
      element: user ? <Navigate to="/dashboard" replace /> : <Login onLogin={onLogin} />,
    },
    {
      path: '/',
      element: <AppShell user={user} onLogout={onLogout} onRoleChange={onRoleChange} />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: 'dashboard',
          element: user ? <Dashboard role={user.role} /> : <Navigate to="/login" />,
        },
        {
          path: 'vouchers',
          element: user ? <Vouchers role={user.role} /> : <Navigate to="/login" />,
        },
        {
          path: 'deliveries',
          element: <Deliveries />,
        },
        {
          path: 'stock',
          element: user ? <Stock role={user.role} /> : <Navigate to="/login" />,
        },
        {
          path: 'logistics',
          element: user ? <Logistics role={user.role} /> : <Navigate to="/login" />,
        },
        {
          path: 'registration',
          element: <Registration />,
        },
        {
          path: 'payments',
          element: user?.role === UserRole.FARMER ? <Navigate to="/wallet" replace /> : <Payments />,
        },
        {
          path: 'wallet',
          element: user?.role === UserRole.FARMER ? <Wallet user={user} /> : <Navigate to="/dashboard" replace />,
        },
        {
          path: 'security',
          element: <Security />,
        },
        {
          path: 'production',
          element: user ? <FarmProduction /> : <Navigate to="/login" />,
        },
        {
          path: 'profile',
          element: user ? <Profile user={user} onLogout={onLogout} /> : <Navigate to="/login" />,
        },
        {
          path: 'settings',
          element: user ? <Settings /> : <Navigate to="/login" />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/dashboard" replace />,
    },
  ]);
};

export default createAppRouter;
