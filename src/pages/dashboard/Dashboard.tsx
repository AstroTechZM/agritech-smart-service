import React from 'react';
import { UserRole } from '@/src/types';
import FarmerDashboard from './FarmerDashboard';
import AgroDealerDashboard from './AgroDealerDashboard';
import AgentDashboard from './AgentDashboard';
import AdminDashboard from './AdminDashboard';

interface DashboardProps {
  user: User | null;
}

export const Dashboard = ({ user }: DashboardProps) => {
  const role = user?.role || UserRole.FARMER;
  
  switch (role) {
    case UserRole.FARMER:
      return <FarmerDashboard user={user} />;
    case UserRole.AGRO_DEALER:
      return <AgroDealerDashboard user={user} />;
    case UserRole.AGENT:
      return <AgentDashboard user={user} />;
    case UserRole.ADMIN:
      return <AdminDashboard user={user} />;
    default:
      return <FarmerDashboard user={user} />;
  }
};

export default Dashboard;
