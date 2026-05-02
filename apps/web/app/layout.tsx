import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartNotes',
  description: 'Capture ideas quickly and keep notes organized.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white/90">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-5">
              <span className="text-sm font-semibold tracking-wide text-slate-900">
                SmartNotes
              </span>
            </div>
          </header>
          {children}
          <footer className="border-t border-slate-200 bg-white/90">
            <div className="mx-auto w-full max-w-6xl px-5 py-4 text-xs text-slate-500">
              Built with Next.js and Tailwind CSS.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
