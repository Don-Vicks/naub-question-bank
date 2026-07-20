'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Search,
  Upload,
  Building2,
  ArrowRight,
  BookOpen,
  Clock,
  Sparkles,
  FileText,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFaculties } from '@/lib/hooks/useQuestionBank';
import { FACULTIES, getDepartmentsByFaculty } from '@/lib/naub-data';
import { AuthGuard } from '@/components/layout/AuthGuard';

const QUICK_ACTIONS = [
  {
    href: '/browse',
    label: 'Browse',
    description: 'Explore papers by faculty',
    icon: Building2,
    gradient: 'from-naub-teal to-naub-teal/80',
  },
  {
    href: '/upload',
    label: 'Upload',
    description: 'Share past questions',
    icon: Upload,
    gradient: 'from-army to-army-700',
  },
  {
    href: '/search',
    label: 'Search',
    description: 'Find any course',
    icon: Search,
    gradient: 'from-naub-gold to-marigold-600',
  },
] as const;

function DashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = user?.name?.split(' ')[0] || 'Student';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="page-desktop">
      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8 lg:p-8">
        {/* ── Left column ── */}
        <div>
          {/* Welcome hero */}
          <div className="relative overflow-hidden rounded-card-xl bg-gradient-army px-6 py-8 md:px-8 lg:px-10 lg:py-10">
            {/* Decorative blurs */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.06] blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-naub-teal/15 blur-3xl" />
            <div className="absolute right-1/3 top-1/2 h-3 w-3 rounded-full bg-naub-gold/25 animate-float" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                    <Sparkles size={10} strokeWidth={2.5} />
                    NAUB Question Bank
                  </div>
                  <h1
                    className="text-2xl font-bold sm:text-3xl lg:text-4xl text-paper tracking-tight"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  >
                    Welcome back, {firstName}
                  </h1>
                  <p className="mt-2 max-w-sm text-xs sm:text-sm text-paper/70 leading-relaxed">
                    Pick up where you left off, or explore new papers across all faculties.
                  </p>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm md:flex flex-shrink-0">
                  <BookOpen size={24} strokeWidth={1.75} className="text-paper/60" />
                </div>
              </div>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="mt-5">
                <div className="relative group">
                  <Search
                    size={16}
                    strokeWidth={1.75}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-paper/40 transition-colors duration-200 group-focus-within:text-paper/70"
                  />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, topics..."
                    className="w-full rounded-2xl bg-white/10 pl-10 pr-4 sm:pr-20 py-3 text-sm text-paper placeholder:text-paper/40 backdrop-blur-sm outline-none transition-all duration-200 focus:bg-white/15 focus:ring-1 focus:ring-white/20 min-h-[44px]"
                  />
                  <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-paper/50">
                    /
                  </kbd>
                </div>
              </form>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 stagger">
            {QUICK_ACTIONS.map(({ href, label, description, icon: Icon, gradient }) => (
              <Link
                key={href}
                href={href}
                className="card-interactive group relative overflow-hidden p-3.5 text-left flex items-center justify-between sm:block"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]`} />
                <div className="relative flex items-center gap-3 sm:block">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md sm:mb-3`}>
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{label}</p>
                    <p className="text-[11px] text-muted leading-snug truncate sm:whitespace-normal">{description}</p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="relative flex-shrink-0 text-muted/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-army sm:absolute sm:right-3 sm:top-4"
                />
              </Link>
            ))}
          </div>

          {/* Faculties */}
          <div className="mt-8">
            <div className="section-header">
              <h2 className="section-title">Faculties</h2>
              <Link
                href="/browse"
                className="text-caption font-semibold text-army transition-colors hover:text-army-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-2 stagger">
              {FACULTIES.map((faculty) => {
                const deptCount = getDepartmentsByFaculty(faculty.id).length;
                return (
                  <Link
                    key={faculty.id}
                    href={`/browse/${faculty.id}`}
                    className="card-interactive group relative flex items-center gap-4 overflow-hidden p-4"
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-army via-army/50 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100" />

                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-army/5 to-army/10 transition-all duration-300 group-hover:from-army group-hover:to-army/80 group-hover:shadow-glow-sm group-hover:scale-110">
                      <span className="text-xs font-bold text-army transition-colors duration-300 group-hover:text-white">
                        {faculty.abbreviation}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-heading text-ink truncate">{faculty.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="h-1 w-1 rounded-full bg-naub-green" />
                        <p className="text-caption text-muted">
                          {deptCount} {deptCount === 1 ? 'department' : 'departments'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      strokeWidth={2}
                      className="text-muted/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-army"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right column — sidebar cards (desktop only) ── */}
        <div className="hidden lg:block">
          <div className="sticky top-8 space-y-5">
            {/* Quick stats */}
            <div className="rounded-card-xl border border-line bg-white p-6 shadow-card">
              <h3 className="section-title mb-4">Platform stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Faculties', value: '5', icon: Building2, color: 'bg-naub-teal/10 text-naub-teal' },
                  { label: 'Departments', value: '31', icon: TrendingUp, color: 'bg-naub-green-light text-naub-green' },
                  { label: 'Sessions covered', value: '10+', icon: Clock, color: 'bg-naub-gold-light text-naub-gold' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                      <Icon size={18} strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-heading text-ink tabular-nums">{value}</p>
                      <p className="text-caption text-muted">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-card-xl border border-line bg-white p-6 shadow-card">
              <h3 className="section-title mb-4">Quick links</h3>
              <div className="space-y-1">
                {[
                  { href: '/browse', label: 'Browse all papers', icon: Building2 },
                  { href: '/upload', label: 'Upload a paper', icon: Upload },
                  { href: '/search', label: 'Search courses', icon: Search },
                  { href: '/bookmarks', label: 'Your bookmarks', icon: FileText },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-all duration-200 hover:bg-army/5 hover:text-army"
                  >
                    <Icon size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-medium">{label}</span>
                    <ChevronRight
                      size={14}
                      strokeWidth={2}
                      className="ml-auto text-muted/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-army"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="relative overflow-hidden rounded-card-xl bg-gradient-naub p-6 text-center shadow-glass">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.05] blur-2xl" />
              <div className="relative">
                <h3 className="text-heading text-white">Contribute</h3>
                <p className="text-caption text-white/55 mt-1">
                  Help fellow students by uploading past questions.
                </p>
                <Link
                  href="/upload"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-naub-teal transition-all duration-200 hover:shadow-elevated hover:translate-y-[-1px]"
                >
                  <Upload size={14} strokeWidth={2} />
                  Upload now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
