'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MOBILE_NAV_ITEMS } from '@/lib/nav-items';

const PAGE_TITLES: Record<string, string> = {
  '/search': 'Search',
  '/flashcards': 'Flashcards',
  '/practice': 'Practice',
  '/bookmarks': 'Saved Shelf',
  '/profile': 'Profile & Settings',
  '/upload': 'Upload',
  '/browse': 'Browse',
  '/admin': 'Admin',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'paper') return 'Question Paper';
  if (segments[0] === 'question') return 'Question';
  if (segments[0] === 'flashcards' && segments.length > 1) return 'Flashcards';
  if (segments[0] === 'browse' && segments.length === 1) return 'Browse';
  if (segments[0] === 'browse' && segments.length === 2) return 'Faculty';
  if (segments[0] === 'browse' && segments.length === 3) return 'Department';
  if (segments[0] === 'browse' && segments.length === 4) return 'Course';
  if (segments[0] === 'admin') return 'Admin';

  return '';
}

export function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const isLanding = pathname === '/';
  const isTopLevel = MOBILE_NAV_ITEMS.some(
    (item) => item.href === pathname
  );
  const isAdmin = pathname.startsWith('/admin');

  if (isLanding || isTopLevel || isAdmin) return null;

  const title = getPageTitle(pathname);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/home');
    }
  };

  return (
    <div className="lg:hidden sticky top-0 z-40 flex items-center gap-3 bg-gradient-naub px-4 py-3 shadow-card">
      <button
        onClick={handleBack}
        aria-label="Go back"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-paper transition-all duration-200 hover:bg-white/10 active:scale-95"
      >
        <ArrowLeft size={20} strokeWidth={1.75} />
      </button>
      {title && (
        <p className="text-sm font-semibold text-paper truncate">{title}</p>
      )}
    </div>
  );
}
