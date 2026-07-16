import type { Metadata, Viewport } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/layout/QueryProvider';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { OfflineBanner } from '@/components/layout/OfflineBanner';

export const metadata: Metadata = {
  title: 'Padi — NAUB past questions, answered',
  description:
    'Nigerian Army University Biu past questions organized by faculty, department, and course.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#E40000',
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
      <body className="font-sans antialiased bg-paper">
        <QueryProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="min-h-screen flex-1 lg:ml-72">
              <OfflineBanner />
              <main className="px-4 pb-24 pt-4 md:px-6 md:pb-8 md:pt-5 lg:px-8 lg:pb-8 lg:pt-5">{children}</main>
            </div>
          </div>
          <BottomNav />
        </QueryProvider>
      </body>
    </html>
  );
}
