'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '@/lib/actions/auth';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('magic_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('magic_user', JSON.stringify(result.user));
    } else {
      throw new Error(result.error);
    }
  };

  const register = async (email: string, password: string) => {
    const result = await registerUser(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('magic_user', JSON.stringify(result.user));
    } else {
      throw new Error(result.error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('magic_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
