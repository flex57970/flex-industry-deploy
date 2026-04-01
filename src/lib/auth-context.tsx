'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from './api';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('flex-token');
    if (storedToken) {
      setToken(storedToken);
      authAPI
        .me(storedToken)
        .then((data: unknown) => {
          setUser((data as { user: User }).user);
        })
        .catch(() => {
          localStorage.removeItem('flex-token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = (await authAPI.login({ email, password })) as { user: User; token: string };
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('flex-token', data.token);
  };

  const register = async (formData: { firstName: string; lastName: string; email: string; password: string }) => {
    const data = (await authAPI.register(formData)) as { user: User; token: string };
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('flex-token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('flex-token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
