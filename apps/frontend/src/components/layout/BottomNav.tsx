'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NAV_ITEMS } from '@/lib/nav-items';

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="mx-2 mb-2 rounded-2xl border border-white/20 bg-ink/95 backdrop-blur-2xl shadow-glass">
        <div className="flex items-center justify-between px-1 py-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2 px-1 min-h-[44px] transition-all duration-200',
                  active
                    ? 'bg-army/20 text-army font-semibold'
                    : 'text-white/40 hover:text-white/70',
                )}
                aria-label={label}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.25 : 1.75}
                  className="transition-transform duration-200 flex-shrink-0"
                />
                <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
