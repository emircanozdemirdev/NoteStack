'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthMeResponse } from '../lib/api';
import {
  getCurrentUser,
  loginWithCredentials,
  registerWithCredentials,
} from '../lib/api';
import {
  clearStoredTokens,
  getStoredAccessToken,
  setStoredTokens,
} from '../lib/auth-storage';

type AuthContextValue = {
  user: AuthMeResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthMeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const access = getStoredAccessToken();
    if (!access) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await getCurrentUser(access);
      setUser(me);
    } catch {
      clearStoredTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await loginWithCredentials(email, password);
    setStoredTokens(tokens.accessToken, tokens.refreshToken);
    const me = await getCurrentUser(tokens.accessToken);
    setUser(me);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const tokens = await registerWithCredentials(email, password);
    setStoredTokens(tokens.accessToken, tokens.refreshToken);
    const me = await getCurrentUser(tokens.accessToken);
    setUser(me);
  }, []);

  const logout = useCallback(() => {
    clearStoredTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
