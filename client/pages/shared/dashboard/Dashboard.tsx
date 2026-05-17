// client/pages/shared/dashboard/Dashboard.tsx
import React from 'react';
import { UserRole, User } from '@/types';
import FarmerDashboard from './FarmerDashboard';
import AgroDealerDashboard from './AgroDealerDashboard';
import AgentDashboard from './AgentDashboard';
import AdminDashboard from './AdminDashboard';

interface DashboardProps {
  user: User | null;
}

export const Dashboard = ({ user }: DashboardProps) => {
  switch (user?.role) {
    case UserRole.FARMER:
      return <FarmerDashboard user={user} />;
    case UserRole.AGRO_DEALER:
      return <AgroDealerDashboard />;
    case UserRole.AGENT:
      return <AgentDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    default:
      return <FarmerDashboard user={user} />;
  }
};

export default Dashboard;

