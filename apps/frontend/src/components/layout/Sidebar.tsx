'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Logo } from '@/components/ui/Logo';
import { NAV_ITEMS } from '@/lib/nav-items';
import { useAuth } from '@/lib/hooks/useAuth';
import { LogOut, Shield } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (pathname.startsWith('/admin')) return null;

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-shrink-0 flex-col border-r border-line-light bg-white/80 backdrop-blur-xl p-6 lg:flex">
      {/* Subtle dot texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative flex flex-1 flex-col">
        {/* Logo */}
        <Logo href="/" className="mb-10 px-1" />

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm transition-all duration-200',
                  active
                    ? 'bg-gradient-to-r from-army/10 via-army/8 to-transparent text-army font-semibold shadow-sm shadow-army/5'
                    : 'text-muted hover:bg-army/5 hover:text-army font-medium',
                )}
              >
                {/* Active indicator bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-army shadow-glow-sm" />
                )}
                <Icon
                  size={19}
                  strokeWidth={active ? 2.25 : 1.75}
                  className={clsx(
                    'transition-transform duration-200 flex-shrink-0',
                    active ? 'text-army' : 'text-muted group-hover:text-army group-hover:scale-110',
                  )}
                />
                <span>{label}</span>
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <>
              <div className="my-4 mx-2 border-t border-line-light" />
              <Link
                href="/admin"
                className={clsx(
                  'group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm transition-all duration-200',
                  pathname.startsWith('/admin')
                    ? 'bg-gradient-to-r from-naub-gold-light via-naub-gold-light/80 to-transparent text-naub-gold border border-naub-gold/20 font-semibold shadow-sm shadow-naub-gold/10'
                    : 'text-muted hover:bg-naub-gold-light/50 hover:text-naub-gold font-medium',
                )}
              >
                {pathname.startsWith('/admin') && (
                  <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-naub-gold" />
                )}
                <Shield
                  size={19}
                  strokeWidth={1.75}
                  className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                />
                <span>Admin</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* User section */}
      {user && (
        <div className="relative border-t border-line-light pt-5 mt-2">
          <div className="flex items-center gap-3.5 px-1 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-army text-xs font-bold text-white shadow-glow-sm transition-transform duration-200 hover:scale-105">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-[11px] text-muted">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-muted transition-all duration-200 hover:bg-army-50 hover:text-army"
          >
            <LogOut size={14} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
