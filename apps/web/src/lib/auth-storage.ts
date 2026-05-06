/**
 * Client-side session persistence. HttpOnly cookies via a BFF/proxy are
 * preferred for production hardening; sessionStorage keeps the gated plan
 * workable while the API runs on a separate origin.
 */
const ACCESS_KEY = 'smartnotes_access_token';
const REFRESH_KEY = 'smartnotes_refresh_token';

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ACCESS_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(REFRESH_KEY);
}

export function setStoredTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ACCESS_KEY, accessToken);
  sessionStorage.setItem(REFRESH_KEY, refreshToken);
}

export function setStoredAccessToken(accessToken: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ACCESS_KEY, accessToken);
}

export function clearStoredTokens(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}
