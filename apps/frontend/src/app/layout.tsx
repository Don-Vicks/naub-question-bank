import type { Metadata, Viewport } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/layout/QueryProvider';
import { AppShell } from '@/components/layout/AppShell';

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
          <AppShell>{children}</AppShell>
        </QueryProvider>
      </body>
    </html>
  );
}
