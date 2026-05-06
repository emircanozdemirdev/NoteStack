import type { Metadata } from 'next';
import { AppHeader } from './app-header';
import { Providers } from './providers';
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
        <Providers>
          <div className="min-h-screen">
            <AppHeader />
            {children}
            <footer className="border-t border-slate-200 bg-white/90">
              <div className="mx-auto w-full max-w-6xl px-5 py-4 text-xs text-slate-500">
                Built with Next.js and Tailwind CSS.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
