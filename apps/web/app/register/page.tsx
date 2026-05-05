'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../../src/context/auth-context';

export default function RegisterPage() {
  const { register, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace('/account');
    }
  }, [user, loading, router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email.trim(), password);
      router.replace('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || user) {
    return (
      <main className="mx-auto w-full max-w-md px-5 py-16 text-center text-sm text-slate-600">
        Loading…
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md px-5 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Account
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Create account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Use your email and a secure password to start using SmartNotes.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
          <div className="space-y-2">
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-slate-900/5 transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="register-password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-slate-900/5 transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20"
              placeholder="At least 8 characters"
            />
          </div>

          {error ? (
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-slate-900 underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
        <p className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
