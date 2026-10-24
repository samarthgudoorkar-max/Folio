'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from './types';
import { DEMO_USERS } from './mock-data';

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
    async function loadSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.warn('Could not load session from server, using demo user', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const switchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to switch user', err);
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
