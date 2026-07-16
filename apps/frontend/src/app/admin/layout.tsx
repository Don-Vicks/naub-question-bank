'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { AdminGuard } from '@/components/layout/AdminGuard';
import {
  LayoutDashboard,
  Upload,
  ClipboardCheck,
  Users,
  BarChart3,
  ArrowLeft,
  Shield,
} from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/uploads', label: 'Uploads', icon: Upload },
  { href: '/admin/review', label: 'Review', icon: ClipboardCheck },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/stats', label: 'Stats', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col border-r border-line-light bg-white/80 backdrop-blur-xl p-5 lg:flex">
          <div className="mb-2 flex items-center gap-3 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-army shadow-glow-sm">
              <Shield size={16} strokeWidth={2} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-ink" style={{ fontFamily: "'Lora', Georgia, serif" }}>Admin</span>
              <p className="text-[10px] text-muted">Question Bank</p>
            </div>
          </div>

          <Link
            href="/"
            className="mb-6 mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-medium text-muted transition-colors hover:bg-army-50 hover:text-army"
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            Back to main site
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
              const active =
                href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] transition-all duration-200',
                    active
                      ? 'bg-naub-teal text-white font-semibold shadow-glass'
                      : 'text-muted hover:bg-army-50 hover:text-army',
                  )}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-army" />
                  )}
                  <Icon size={17} strokeWidth={active ? 2.25 : 1.75} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1">
          {/* Mobile header */}
          <header className="flex items-center gap-3 border-b border-line-light bg-white/80 backdrop-blur-xl px-5 py-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-army">
              <Shield size={14} strokeWidth={2} className="text-white" />
            </div>
            <span className="text-sm font-bold text-ink">Admin Panel</span>
          </header>

          <main className="px-5 py-5 lg:px-8 lg:py-6">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
