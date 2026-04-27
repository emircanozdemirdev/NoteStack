export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-16">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          Frontend Foundation
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          Organize your notes with a clean and focused workspace
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          SmartNotes helps you capture thoughts quickly, keep notes structured,
          and stay in flow. This landing page is the first UI milestone for the
          web application.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Get Started
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Learn More
          </button>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Fast Capture</h2>
          <p className="mt-2 text-sm text-slate-600">
            Write notes instantly without losing context.
          </p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Clear Structure
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Keep ideas organized with intuitive sections.
          </p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Built to Scale
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Foundation ready for auth, API integration, and notes CRUD.
          </p>
        </article>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">
          API Client Ready
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Configure <code>NEXT_PUBLIC_API_URL</code> in <code>.env.local</code>{' '}
          to connect this web app to the backend API.
        </p>
      </section>
    </main>
  );
}
