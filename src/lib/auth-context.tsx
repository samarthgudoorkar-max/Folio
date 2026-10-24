'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from './types';
import { DEMO_USERS } from './mock-data';
import { getActiveUser, setActiveUser } from './data-service';

interface AuthContextType {
  user: User;
  allDemoUsers: User[];
  switchUser: (userId: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_USERS[0],
  allDemoUsers: DEMO_USERS,
  switchUser: async () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(DEMO_USERS[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const active = getActiveUser();
    setUser(active);
    setIsLoading(false);
  }, []);

  const switchUser = async (userId: string) => {
    const targetUser = DEMO_USERS.find(u => u.id === userId);
    if (targetUser) {
      setActiveUser(targetUser.id);
      setUser(targetUser);
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider value={{ user, allDemoUsers: DEMO_USERS, switchUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
