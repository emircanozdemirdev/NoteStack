'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AuthGuard } from '../../src/components/auth-guard';
import { useAuth } from '../../src/context/auth-context';
import { getStoredAccessToken } from '../../src/lib/auth-storage';
import { listNotes, type NoteItem } from '../../src/lib/api';

function NotesContent() {
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user) return;

    let cancelled = false;
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      setError('Session not found. Please sign in again.');
      setFetching(false);
      return;
    }

    const run = async () => {
      setFetching(true);
      setError(null);
      try {
        const data = await listNotes(accessToken);
        if (!cancelled) {
          setNotes(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load notes.');
        }
      } finally {
        if (!cancelled) {
          setFetching(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Notes
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Your notes
          </h1>
        </div>
        <span className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700">
          {notes.length} item{notes.length === 1 ? '' : 's'}
        </span>
      </div>

      {fetching ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
          Loading notes...
        </div>
      ) : null}

      {error ? (
        <p
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {!fetching && !error && notes.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-700">
            You do not have any notes yet. Creation and editing screens will be
            added in the next phase step.
          </p>
        </div>
      ) : null}

      {!fetching && !error && notes.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-base font-semibold text-slate-900">{note.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{note.content}</p>
              <p className="mt-3 text-xs text-slate-500">
                Updated {new Date(note.updatedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-8">
        <Link
          href="/account"
          className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
        >
          ← Back to account
        </Link>
      </p>
    </main>
  );
}

export default function NotesPage() {
  return (
    <AuthGuard>
      <NotesContent />
    </AuthGuard>
  );
}
