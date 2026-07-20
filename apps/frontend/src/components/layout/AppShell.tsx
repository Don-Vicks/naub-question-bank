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
      <div className="flex min-h-screen w-full max-w-full overflow-x-hidden">
        {!isLanding && <Sidebar />}
        <div className={`flex-1 min-w-0 w-full max-w-full ${isLanding ? '' : 'lg:pl-0'}`}>
          <OfflineBanner />
          <main className="w-full max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
      {!isLanding && <BottomNav />}
    </>
  );
}
