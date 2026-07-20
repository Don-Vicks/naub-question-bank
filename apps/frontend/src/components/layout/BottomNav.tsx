'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { MOBILE_NAV_ITEMS } from '@/lib/nav-items';

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pointer-events-none">
      <div className="mx-3 mb-3 pointer-events-auto rounded-2xl border border-white/15 bg-ink/95 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center justify-between px-1.5 py-1.5">
          {MOBILE_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 px-1 min-h-[48px] transition-all duration-200',
                  active
                    ? 'bg-army/25 text-white font-semibold shadow-sm'
                    : 'text-white/45 hover:text-white/80 active:scale-95',
                )}
                aria-label={label}
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.25 : 1.75}
                  className={clsx(
                    'transition-transform duration-200 flex-shrink-0',
                    active ? 'text-naub-gold scale-110' : '',
                  )}
                />
                <span className={clsx(
                  'text-[10px] tracking-tight whitespace-nowrap',
                  active ? 'font-semibold text-white' : 'font-medium text-white/50'
                )}>
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
