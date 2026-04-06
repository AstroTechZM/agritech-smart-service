import React from 'react';
import { UserRole } from '@/src/types';
import FarmerDashboard from './FarmerDashboard';
import AgroDealerDashboard from './AgroDealerDashboard';
import AgentDashboard from './AgentDashboard';
import AdminDashboard from './AdminDashboard';

interface DashboardProps {
  role: UserRole;
}

export const Dashboard = ({ role }: DashboardProps) => {
  switch (role) {
    case UserRole.FARMER:
      return <FarmerDashboard />;
    case UserRole.AGRO_DEALER:
      return <AgroDealerDashboard />;
    case UserRole.AGENT:
      return <AgentDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    default:
      return <FarmerDashboard />;
  }
};

export default Dashboard;
