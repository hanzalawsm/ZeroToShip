"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { UserProfileResponse } from './types';

interface AuthState {
  user: UserProfileResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await api.getProfile();
      setState(prev => ({
        ...prev,
        user: profile,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch {
      // Token is invalid or expired
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // On mount, check for existing token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setState(prev => ({ ...prev, token: savedToken }));
        refreshProfile();
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [refreshProfile]);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setState(prev => ({ ...prev, token: res.access_token }));
    await refreshProfile();
  };

  const register = async (name: string, email: string, password: string) => {
    await api.register(name, email, password);
    // Login after registration
    const res = await api.login(email, password);
    setState(prev => ({ ...prev, token: res.access_token }));
    // Set random avatar
    const randomNum = Math.floor(Math.random() * 4) + 1;
    await api.updateProfile({ avatar_url: `/avatars/avatar-${randomNum}.jpg` });
    await refreshProfile();
  };

  const logout = () => {
    api.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
