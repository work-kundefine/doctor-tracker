'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  api,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
  removeStoredToken,
} from './api';

interface AuthContextType {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  expirationNotice: string | null;
  login: (token: string, user: any) => void;
  logout: (notice?: string) => void;
  clearExpirationNotice: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  expirationNotice: null,
  login: () => {},
  logout: () => {},
  clearExpirationNotice: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expirationNotice, setExpirationNotice] = useState<string | null>(null);

  const logout = useCallback(
    (notice?: string) => {
      removeStoredToken();
      setUser(null);
      setToken(null);
      if (notice) {
        setExpirationNotice(notice);
      }
      router.push('/login' + (notice ? '?expired=true' : ''));
    },
    [router]
  );

  const login = useCallback(
    (newToken: string, newUser: any) => {
      setStoredToken(newToken);
      setStoredUser(newUser);
      setToken(newToken);
      setUser(newUser);
      setExpirationNotice(null);
      router.push('/doctors');
    },
    [router]
  );

  // Initialize and check token validity against the backend
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);

      // Validate session with backend
      api.auth.getMe().then((res) => {
        if (!res.success) {
          logout('Your session has expired. Please log in again to continue.');
        } else if (res.data) {
          setUser(res.data);
        }
      });
    }
    setIsLoading(false);
  }, [logout]);

  // Global listener for dt:session_expired dispatched from API requests
  useEffect(() => {
    const handleSessionExpiredEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string }>;
      const reason = customEvent.detail?.message || 'Your session has expired. Please log in again.';
      logout(reason);
    };

    window.addEventListener('dt:session_expired', handleSessionExpiredEvent);
    return () => {
      window.removeEventListener('dt:session_expired', handleSessionExpiredEvent);
    };
  }, [logout]);

  // Route protection
  useEffect(() => {
    if (isLoading) return;
    const isAuthRoute = pathname === '/login';

    if (!token && !isAuthRoute) {
      router.push('/login');
    } else if (token && isAuthRoute) {
      router.push('/doctors');
    }
  }, [token, isLoading, pathname, router]);

  const clearExpirationNotice = useCallback(() => {
    setExpirationNotice(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        expirationNotice,
        login,
        logout,
        clearExpirationNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
