import React, { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { User, UserRole } from '@/src/types';
import { MOCK_USERS } from '@/src/data/mockData';
import { createAppRouter } from '@/src/routes';
import { Toaster } from 'sonner';

import { WalletProvider } from '@/src/context/WalletContext';
import { FarmerProvider } from '@/src/context/FarmerContext';

export const App = () => {
  // Authentication State
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('agritech_user_v2');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('agritech_user_v2', JSON.stringify(user));
    } else {
      localStorage.removeItem('agritech_user_v2');
    }
  }, [user]);

  // Auth Handlers
  const handleLogin = (role: UserRole) => {
    const mockUser = MOCK_USERS[role];
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleRoleChange = (role: UserRole) => {
    const mockUser = MOCK_USERS[role];
    setUser(mockUser);
  };

  // Create router instance with necessary props
  const router = createAppRouter({
    user,
    onLogin: (u) => setUser(u),
    onLogout: handleLogout,
    onRoleChange: handleRoleChange,
  });

  return (
    <FarmerProvider>
      <WalletProvider>
        <Toaster position="top-center" richColors />
        <RouterProvider router={router} />
      </WalletProvider>
    </FarmerProvider>
  );
};

export default App;
