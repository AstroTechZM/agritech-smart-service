import React from 'react';
import { createHashRouter, Navigate, Outlet } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';

import Login from '@/pages/shared/auth/Login';
import PublicRegistration from '@/pages/shared/auth/Registration';
import Dashboard from '@/pages/shared/dashboard/Dashboard';
import Profile from '@/pages/shared/profile/Profile';
import Settings from '@/pages/shared/settings/Settings';
import Security from '@/pages/shared/security/Security';

import Vouchers from '@/pages/farmer/vouchers/Vouchers';
import Deliveries from '@/pages/farmer/deliveries/Deliveries';
import FarmProduction from '@/pages/farmer/production/FarmProduction';
import Wallet from '@/pages/farmer/wallet/Wallet';

import AgentRegistration from '@/pages/agent/registration/Registration';
import RedemptionPortal from '@/pages/agent/redemption/RedemptionPortal';
import Stock from '@/pages/agent/stock/Stock';

import Payments from '@/pages/admin/payments/Payments';
import Logistics from '@/pages/admin/logistics/Logistics';

import { User, UserRole } from '@/types';

const ProtectedRoute = ({ user, allowedRoles }: { user: User | null; allowedRoles?: UserRole[] }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
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
      // Public self-registration for new farmers
      path: '/register',
      element: user ? <Navigate to="/dashboard" replace /> : <PublicRegistration onLogin={onLogin} />,
    },
    {
      path: '/',
      element: <AppShell user={user} onLogout={onLogout} onRoleChange={onRoleChange} />,
      children: [
        {
          element: <ProtectedRoute user={user} />,
          children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: 'dashboard', element: <Dashboard user={user} /> },
            { path: 'vouchers', element: <Vouchers role={user?.role || UserRole.FARMER} /> },
            { path: 'redemption', element: <RedemptionPortal /> },
            { path: 'deliveries', element: <Deliveries /> },
            { path: 'stock', element: <Stock role={user?.role || UserRole.FARMER} /> },
            { path: 'logistics', element: <Logistics role={user?.role || UserRole.FARMER} /> },
            { path: 'profile', element: <Profile user={user!} onLogout={onLogout} onSave={onProfileSave} /> },
            { path: 'settings', element: <Settings /> },
            {
              // Agent-only internal registration portal
              element: <ProtectedRoute user={user} allowedRoles={[UserRole.AGENT, UserRole.ADMIN]} />,
              children: [
                { path: 'registration', element: <AgentRegistration /> },
              ],
            },
            {
              element: <ProtectedRoute user={user} allowedRoles={[UserRole.FARMER]} />,
              children: [
                { path: 'wallet', element: <Wallet user={user!} /> },
                { path: 'production', element: <FarmProduction /> },
              ],
            },
            {
              element: <ProtectedRoute user={user} allowedRoles={[UserRole.ADMIN, UserRole.AGENT, UserRole.AGRO_DEALER]} />,
              children: [
                { path: 'payments', element: <Payments /> },
                { path: 'security', element: <Security /> },
              ],
            },
          ],
        },
      ],
    },
    { path: '*', element: <Navigate to="/dashboard" replace /> },
  ]);
};

export default createAppRouter;
