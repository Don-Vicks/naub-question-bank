'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from './OfflineBanner';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <>
      <div className="flex min-h-screen">
        {!isLanding && <Sidebar />}
        <div className={`min-h-screen flex-1 ${isLanding ? '' : 'lg:ml-72'}`}>
          <OfflineBanner />
          <main className={isLanding ? '' : 'px-4 pb-24 pt-4 md:px-6 md:pb-8 md:pt-5 lg:px-8 lg:pb-8 lg:pt-5'}>
            {children}
          </main>
        </div>
      </div>
      {!isLanding && <BottomNav />}
    </>
  );
}
