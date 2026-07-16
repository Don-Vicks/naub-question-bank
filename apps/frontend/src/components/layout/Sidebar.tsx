'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NAV_ITEMS } from '@/lib/nav-items';
import { useAuthStore } from '@/lib/auth-store';
import { LogOut, Shield } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  if (pathname.startsWith('/admin')) return null;

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-shrink-0 flex-col border-r border-line-light bg-white/80 backdrop-blur-xl p-6 lg:flex">
      {/* Logo */}
      <Link href="/" className="mb-10 flex items-center gap-3.5 px-1 group">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-army shadow-glow transition-all duration-300 group-hover:shadow-glow group-hover:scale-105">
          <span className="text-base font-extrabold text-white">P</span>
        </div>
        <div>
          <span className="text-xl font-extrabold text-ink tracking-tight" style={{ fontFamily: "'Lora', Georgia, serif" }}>Padi</span>
          <p className="text-[10px] font-medium text-muted tracking-wide">NAUB Question Bank</p>
        </div>
      </Link>

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
                'group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm transition-all duration-200',
                active
                  ? 'bg-army/10 text-army font-semibold'
                  : 'text-muted hover:bg-army/5 hover:text-army font-medium',
              )}
            >
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
                'group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm transition-all duration-200',
                pathname.startsWith('/admin')
                  ? 'bg-naub-gold-light text-naub-gold border border-naub-gold/20 font-semibold'
                  : 'text-muted hover:bg-naub-gold-light/50 hover:text-naub-gold font-medium',
              )}
            >
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

      {/* User section */}
      {user && (
        <div className="border-t border-line-light pt-5 mt-2">
          <div className="flex items-center gap-3.5 px-1 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-army text-xs font-bold text-white shadow-glow-sm">
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
