'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Basic simulation: Check against localStorage users
    const users = JSON.parse(localStorage.getItem('magic_registered_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const sessionUser = { email };
      setUser(sessionUser);
      localStorage.setItem('magic_user', JSON.stringify(sessionUser));
    } else {
      throw new Error('Invalid email or password! Try again magic user! ✨');
    }
  };

  const register = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('magic_registered_users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      throw new Error('This email is already part of the magic academy! 🪄');
    }
    
    users.push({ email, password });
    localStorage.setItem('magic_registered_users', JSON.stringify(users));
    
    const sessionUser = { email };
    setUser(sessionUser);
    localStorage.setItem('magic_user', JSON.stringify(sessionUser));
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
