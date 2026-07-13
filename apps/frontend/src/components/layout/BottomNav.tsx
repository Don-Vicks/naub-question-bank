'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NAV_ITEMS } from '@/lib/nav-items';

// md:hidden - the Sidebar takes over navigation at that breakpoint. Fixed
// to the viewport, not a max-w-md wrapper, so it stays full-width on the
// small screens it's actually meant for.
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t border-line bg-white py-2 md:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
            aria-label={label}
          >
            <Icon size={20} stroke={1.75} className={clsx(active ? 'text-ink' : 'text-muted')} />
          </Link>
        );
      })}
    </nav>
  );
}
