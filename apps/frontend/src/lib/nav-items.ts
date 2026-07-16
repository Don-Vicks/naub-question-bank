import {
  Home,
  Building2,
  Upload,
  Search,
  Bookmark,
  User,
  LayoutDashboard,
  Layers,
} from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/browse', label: 'Browse', icon: Building2 },
  { href: '/flashcards', label: 'Flashcards', icon: Layers },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
];

export const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/uploads', label: 'Uploads', icon: Upload },
  { href: '/admin/review', label: 'Review', icon: Search },
  { href: '/admin/users', label: 'Users', icon: User },
  { href: '/admin/stats', label: 'Stats', icon: Building2 },
];
