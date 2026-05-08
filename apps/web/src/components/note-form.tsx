'use client';

import { useState, type FormEvent } from 'react';

type NoteFormProps = {
  mode: 'create' | 'edit';
  initialTitle?: string;
  initialContent?: string;
  submittingLabel?: string;
  submitLabel?: string;
  onSubmit: (input: { title: string; content: string }) => Promise<void>;
};

export function NoteForm({
  mode,
  initialTitle = '',
  initialContent = '',
  submittingLabel,
  submitLabel,
  onSubmit,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), content });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed.');
    } finally {
      setSubmitting(false);
    }
  }

  const effectiveSubmitLabel = submitLabel ?? (mode === 'create' ? 'Create note' : 'Save changes');
  const effectiveSubmittingLabel =
    submittingLabel ?? (mode === 'create' ? 'Creating…' : 'Saving…');

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label
          htmlFor="note-title"
          className="block text-sm font-medium text-slate-700"
        >
          Title
        </label>
        <input
          id="note-title"
          name="title"
          type="text"
          required
          minLength={1}
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-slate-900/5 transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20"
          placeholder="Note title"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="note-content"
          className="block text-sm font-medium text-slate-700"
        >
          Content
        </label>
        <textarea
          id="note-content"
          name="content"
          rows={8}
          maxLength={10000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-slate-900/5 transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20"
          placeholder="Write your note here..."
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
        className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? effectiveSubmittingLabel : effectiveSubmitLabel}
      </button>
    </form>
  );
}
