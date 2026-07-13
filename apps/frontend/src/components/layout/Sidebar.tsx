'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NAV_ITEMS } from '@/lib/nav-items';

// Visible at md+ only - see BottomNav for the mobile equivalent. A bottom
// tab bar stretched across a desktop viewport reads as unfinished, so this
// is a genuinely different component, not a resized copy of the mobile one.
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-56 flex-shrink-0 flex-col border-r border-line bg-white p-4 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink">
          <span className="text-xs font-medium text-paper">P</span>
        </div>
        <span className="text-[15px] font-medium text-ink">Padi</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-2.5 rounded-card px-2.5 py-2 text-[13px]',
                active ? 'bg-paper font-medium text-ink' : 'text-muted',
              )}
            >
              <Icon size={17} stroke={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
