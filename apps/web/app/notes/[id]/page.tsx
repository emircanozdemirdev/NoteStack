'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthGuard } from '../../../src/components/auth-guard';
import { NoteForm } from '../../../src/components/note-form';
import { getStoredAccessToken } from '../../../src/lib/auth-storage';
import { getNote, updateNote, type NoteItem } from '../../../src/lib/api';

function NoteDetailContent() {
  const params = useParams<{ id: string }>();
  const noteId = params.id;
  const [note, setNote] = useState<NoteItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      const accessToken = getStoredAccessToken();
      if (!accessToken) {
        setError('Session not found. Please sign in again.');
        setLoading(false);
        return;
      }

      try {
        const data = await getNote(accessToken, noteId);
        if (!cancelled) {
          setNote(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load note.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [noteId]);

  async function handleUpdate(input: { title: string; content: string }) {
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      throw new Error('Session not found. Please sign in again.');
    }
    const updated = await updateNote(accessToken, noteId, input);
    setNote(updated);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Notes
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Note details
        </h1>

        {loading ? (
          <p className="mt-6 text-sm text-slate-600">Loading note...</p>
        ) : null}

        {error ? (
          <p
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {!loading && !error && note ? (
          <div className="mt-8">
            <NoteForm
              mode="edit"
              initialTitle={note.title}
              initialContent={note.content}
              onSubmit={handleUpdate}
            />
            <p className="mt-4 text-xs text-slate-500">
              Last updated {new Date(note.updatedAt).toLocaleString()}
            </p>
          </div>
        ) : null}

        <p className="mt-6">
          <Link
            href="/notes"
            className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            ← Back to notes
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function NoteDetailPage() {
  return (
    <AuthGuard>
      <NoteDetailContent />
    </AuthGuard>
  );
}
