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
        <div className={`flex-1 min-w-0 ${isLanding ? '' : 'lg:pl-0'}`}>
          <OfflineBanner />
          <main>
            {children}
          </main>
        </div>
      </div>
      {!isLanding && <BottomNav />}
    </>
  );
}
