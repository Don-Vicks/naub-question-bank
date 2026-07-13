import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/layout/QueryProvider';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { OfflineBanner } from '@/components/layout/OfflineBanner';

export const metadata: Metadata = {
  title: 'Padi — NAUB past questions, answered',
  description:
    'Nigerian Army University Biu past questions with worked answers, organized by course.',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#1B2340',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <QueryProvider>
          {/* Sidebar (md+) + content, side by side. On mobile the sidebar
              is display:none via its own md:flex class, so this collapses
              to just the content column with the fixed BottomNav below. */}
          <div className="mx-auto flex max-w-6xl">
            <Sidebar />
            <div className="min-h-screen flex-1 md:border-l md:border-line">
              <OfflineBanner />
              {/* max-w-md only below md - phone-width column on mobile,
                  full flexible width once the Sidebar takes over layout
                  duties on desktop. This one change is most of the "why
                  does this look cramped on desktop" fix. */}
              <main className="mx-auto w-full max-w-md pb-16 md:max-w-none md:px-8 md:py-6 md:pb-6">
                {children}
              </main>
            </div>
          </div>
          <BottomNav />
        </QueryProvider>
      </body>
    </html>
  );
}
