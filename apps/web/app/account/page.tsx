'use client';

import { AuthGuard } from '../../src/components/auth-guard';
import { useAuth } from '../../src/context/auth-context';

function AccountContent() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-16">
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Account
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Your profile
        </h1>
        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Email</dt>
            <dd className="mt-0.5 text-slate-900">{user.email}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">User ID</dt>
            <dd className="mt-0.5 break-all font-mono text-xs text-slate-800">
              {user.id}
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountContent />
    </AuthGuard>
  );
}
