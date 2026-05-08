'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '../../../src/components/auth-guard';
import { NoteForm } from '../../../src/components/note-form';
import { getStoredAccessToken } from '../../../src/lib/auth-storage';
import { createNote } from '../../../src/lib/api';

function NewNoteContent() {
  const router = useRouter();

  async function handleCreate(input: { title: string; content: string }) {
    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      throw new Error('Session not found. Please sign in again.');
    }
    const created = await createNote(accessToken, input);
    router.replace(`/notes/${created.id}`);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Notes
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Create note
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Add a new note to your workspace.
        </p>

        <div className="mt-8">
          <NoteForm mode="create" onSubmit={handleCreate} />
        </div>

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

export default function NewNotePage() {
  return (
    <AuthGuard>
      <NewNoteContent />
    </AuthGuard>
  );
}
