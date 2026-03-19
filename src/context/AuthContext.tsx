'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '@/lib/actions/auth';

interface User {
  email: string;
  role: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<any>;
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
    if (result.success && 'user' in result && result.user) {
      const userData = { email: result.user.email, role: result.user.role };
      setUser(userData);
      localStorage.setItem('magic_user', JSON.stringify(userData));
    } else {
      throw new Error(result.error);
    }
  };

  const register = async (email: string, password: string) => {
    const result = await registerUser(email, password);
    if (result.success) {
      if ('user' in result && result.user) {
        const userData = { email: result.user.email, role: result.user.role || 'wizard' };
        setUser(userData);
        localStorage.setItem('magic_user', JSON.stringify(userData));
      }
      return result; // Return to handle verification notice in UI
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
