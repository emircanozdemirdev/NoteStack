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
  refreshAccessToken,
  registerWithCredentials,
} from '../lib/api';
import {
  clearStoredTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
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
    const refresh = getStoredRefreshToken();

    if (!access && !refresh) {
      setUser(null);
      setLoading(false);
      return;
    }

    const loadUser = async (accessToken: string) => {
      const me = await getCurrentUser(accessToken);
      setUser(me);
    };

    try {
      if (access) {
        try {
          await loadUser(access);
          return;
        } catch {
          // Access token may be expired; try refresh if available.
        }
      }

      if (!refresh) {
        clearStoredTokens();
        setUser(null);
        return;
      }

      const { accessToken: newAccess } = await refreshAccessToken(refresh);
      setStoredAccessToken(newAccess);
      await loadUser(newAccess);
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
