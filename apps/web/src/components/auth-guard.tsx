'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/auth-context';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const from = encodeURIComponent(pathname || '/account');
      router.replace(`/login?from=${from}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <main className="mx-auto w-full max-w-6xl px-5 py-16 text-center text-sm text-slate-600">
        Loading…
      </main>
    );
  }

  return <>{children}</>;
}
