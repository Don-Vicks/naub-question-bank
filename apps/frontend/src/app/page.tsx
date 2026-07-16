'use client';

import Link from 'next/link';
import { Search, Upload, ArrowRight, Sparkles, BookOpen, TrendingUp, Clock } from 'lucide-react';
import { FACULTIES, getDepartmentsByFaculty } from '@/lib/naub-data';

const QUICK_ACTIONS = [
  {
    href: '/browse',
    label: 'Browse',
    description: 'Find papers',
    icon: Search,
    gradient: 'from-naub-teal to-ink-light',
    iconBg: 'bg-white/10',
  },
  {
    href: '/upload',
    label: 'Upload',
    description: 'Add papers',
    icon: Upload,
    gradient: 'from-army to-army/80',
    iconBg: 'bg-white/20',
  },
] as const;

const STATS = [
  { label: 'Faculties', value: '5', icon: BookOpen },
  { label: 'Departments', value: '31', icon: TrendingUp },
  { label: 'Sessions', value: '10+', icon: Clock },
];

export default function HomePage() {
  return (
    <div className="page-desktop">
      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 lg:p-8">
        {/* Left column */}
        <div>
          {/* Hero */}
          <div className="relative overflow-hidden rounded-card-xl bg-gradient-army px-6 py-8 md:px-8 lg:px-10 lg:py-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-naub-teal/20 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                    <Sparkles size={10} strokeWidth={2} />
                    NAUB Question Bank
                  </div>
                  <h1 className="text-display-lg text-paper tracking-tight" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                    Padi
                  </h1>
                  <p className="mt-2 max-w-sm text-body text-paper/70">
                    Past questions organized by faculty, department, and course.
                  </p>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm md:flex">
                  <BookOpen size={24} strokeWidth={1.75} className="text-paper/70" />
                </div>
              </div>

              <Link
                href="/search"
                className="mt-6 flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3.5 text-sm text-paper/60 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:text-paper/80"
              >
                <Search size={16} strokeWidth={1.75} />
                Search courses, topics...
                <span className="ml-auto rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-semibold">
                  /
                </span>
              </Link>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-6 grid grid-cols-2 gap-3 stagger">
            {QUICK_ACTIONS.map(({ href, label, description, icon: Icon, gradient, iconBg }) => (
              <Link key={href} href={href} className="group relative overflow-hidden rounded-card-xl p-5 text-left">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]`} />
                <div className="relative">
                  <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}>
                    <Icon size={20} strokeWidth={1.75} className="text-ink" />
                  </div>
                  <p className="text-heading text-ink">{label}</p>
                  <p className="text-caption text-muted mt-0.5">{description}</p>
                </div>
                <ArrowRight
                  size={14}
                  strokeWidth={2}
                  className="absolute right-4 top-5 text-muted/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-army"
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
                    className="card-interactive group flex items-center gap-4 p-4"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-army/5 to-army/10 transition-all duration-300 group-hover:from-army group-hover:to-army/80 group-hover:shadow-glow-sm">
                      <span className="text-xs font-bold text-army transition-colors duration-300 group-hover:text-white">
                        {faculty.abbreviation}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-heading text-ink truncate">{faculty.name}</p>
                      <p className="text-caption text-muted mt-0.5">
                        {deptCount} {deptCount === 1 ? 'department' : 'departments'}
                      </p>
                    </div>
                    <ArrowRight
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

        {/* Right column — sidebar cards (desktop only) */}
        <div className="hidden lg:block">
          <div className="sticky top-8 space-y-5">
            {/* Stats */}
            <div className="rounded-card-xl border border-line bg-white p-6 shadow-card">
              <h3 className="section-title mb-4">Quick stats</h3>
              <div className="space-y-3">
                {STATS.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-army-50">
                      <Icon size={18} strokeWidth={1.75} className="text-army" />
                    </div>
                    <div>
                      <p className="text-heading text-ink">{value}</p>
                      <p className="text-caption text-muted">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="rounded-card-xl border border-line bg-white p-6 shadow-card">
              <h3 className="section-title mb-4">Recent activity</h3>
              <div className="space-y-3">
                {[
                  { text: 'MTH 201 uploaded', time: '2h ago', type: 'upload' as const },
                  { text: 'CSC 401 searched', time: '3h ago', type: 'search' as const },
                  { text: 'ENG 301 uploaded', time: '1d ago', type: 'upload' as const },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                      item.type === 'upload' ? 'bg-naub-green' : 'bg-naub-gold'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-caption text-ink">{item.text}</p>
                      <p className="text-[10px] text-muted">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-card-xl bg-gradient-naub p-6 text-center shadow-glass">
              <h3 className="text-heading text-white">Contribute</h3>
              <p className="text-caption text-white/60 mt-1">
                Help fellow students by uploading past questions.
              </p>
              <Link
                href="/upload"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-naub-teal transition-all hover:shadow-elevated hover:translate-y-[-1px]"
              >
                <Upload size={14} strokeWidth={2} />
                Upload now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
