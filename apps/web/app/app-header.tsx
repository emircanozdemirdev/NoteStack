'use client';

import Link from 'next/link';
import { useAuth } from '../src/context/auth-context';

export function AppHeader() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/90">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-slate-900 hover:text-slate-700"
        >
          SmartNotes
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {loading ? (
            <span className="text-slate-400">…</span>
          ) : user ? (
            <>
              <Link
                href="/notes"
                className="font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
              >
                Notes
              </Link>
              <Link
                href="/account"
                className="font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
              >
                Account
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
