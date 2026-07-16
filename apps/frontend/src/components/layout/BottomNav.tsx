'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NAV_ITEMS } from '@/lib/nav-items';

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
      <div className="mx-3 mb-3 rounded-2xl border border-white/30 bg-naub-teal/95 backdrop-blur-2xl shadow-glass">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200',
                  active
                    ? 'text-white'
                    : 'text-paper/40 hover:text-paper/70',
                )}
                aria-label={label}
              >
                {active && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-army" />
                )}
                <Icon
                  size={20}
                  strokeWidth={active ? 2.25 : 1.75}
                  className="transition-transform duration-200"
                />
                <span className="text-[9px] font-semibold tracking-wide">
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
