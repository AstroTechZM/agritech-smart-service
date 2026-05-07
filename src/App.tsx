import React, { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { User, UserRole } from '@/src/types';
import { MOCK_USERS } from '@/src/data/mockData';
import { createAppRouter } from '@/src/routes';

import { WalletProvider } from '@/src/context/WalletContext';

export const App = () => {
  // Authentication State
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('agritech_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('agritech_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agritech_user');
    }
  }, [user]);

  // Auth Handlers
  const handleLogin = (role: UserRole) => {
    // In a real app, this would be an API call with credentials
    // For this demo, we just use the role to pick a mock user
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
    onLogin: (u) => setUser(u), // Modified LoginScreen to return the role or user
    onLogout: handleLogout,
    onRoleChange: handleRoleChange,
  });

  return (
    <WalletProvider>
      <RouterProvider router={router} />
    </WalletProvider>
  );
};

export default App;
