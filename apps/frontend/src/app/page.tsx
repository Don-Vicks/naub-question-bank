'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Search,
  Upload,
  BookOpen,
  ArrowRight,
  Check,
  GraduationCap,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { FACULTIES, getDepartmentsByFaculty } from '@/lib/naub-data';
import { useAuthStore } from '@/lib/auth-store';
import { Logo } from '@/components/ui/Logo';

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find any past question by course code, topic, or keyword across all faculties.',
    color: 'bg-naub-teal/10 text-naub-teal',
  },
  {
    icon: Upload,
    title: 'Easy Upload',
    description: 'Snap a photo or upload a PDF — our pipeline splits pages and extracts questions automatically.',
    color: 'bg-army-50 text-army',
  },
  {
    icon: Layers,
    title: 'Flashcards & OBJ',
    description: 'Study with interactive flip cards and multiple choice quizzes generated from past questions.',
    color: 'bg-naub-green-light text-naub-green',
  },
  {
    icon: BookOpen,
    title: 'Browse by Faculty',
    description: 'Navigate papers organized by faculty, department, and course — exactly like NAUB\'s structure.',
    color: 'bg-naub-gold-light text-naub-gold',
  },
];

const STEPS = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload papers',
    description: 'Upload PDFs or photos of past exam questions from any faculty at NAUB.',
    color: 'from-army to-army-800',
  },
  {
    step: '02',
    icon: Search,
    title: 'AI processes them',
    description: 'Our pipeline splits pages, extracts questions, and organizes them by course.',
    color: 'from-naub-teal to-naub-teal/80',
  },
  {
    step: '03',
    icon: BookOpen,
    title: 'Study & review',
    description: 'Browse by faculty, search by keyword, or use flashcards to revise.',
    color: 'from-naub-green to-naub-green/80',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (hydrated && token) {
      router.replace('/home');
    }
  }, [hydrated, token, router]);

  if (!hydrated || token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-army border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-army">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-white/[0.04] blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-naub-teal/10 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-0">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-16 lg:mb-24">
            <Logo size="md" href="/" />
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-army transition-all hover:shadow-elevated hover:translate-y-[-1px]"
              >
                Get started
              </Link>
            </div>
          </nav>

          {/* Hero content */}
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_480px] lg:gap-16">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                <Sparkles size={12} strokeWidth={2.5} />
                Nigerian Army University Biu
              </div>
              <h1
                className="text-4xl font-bold leading-[1.1] text-white md:text-5xl lg:text-[3.5rem]"
                style={{ fontFamily: "'Lora', Georgia, serif" }}
              >
                Your past questions,
                <br />
                <span className="text-white/75">organized and ready.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-white/55 leading-relaxed">
                Padi collects and organizes past exam papers from every faculty
                at NAUB. Browse, search, and study smarter.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-semibold text-army shadow-elevated transition-all hover:shadow-elevated-lg hover:translate-y-[-2px]"
                >
                  Start studying
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  Browse as guest
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex items-center gap-6 text-xs text-white/40">
                <span className="flex items-center gap-1.5">
                  <Check size={12} strokeWidth={2.5} className="text-naub-green" />
                  Free for all students
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={12} strokeWidth={2.5} className="text-naub-green" />
                  No ads
                </span>
              </div>
            </div>

            {/* Device mockup */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-8 rounded-3xl bg-white/[0.03] blur-2xl" />
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-xl shadow-2xl">
                  <div className="rounded-xl bg-paper overflow-hidden">
                    <div className="flex items-center gap-2 border-b border-line bg-white px-4 py-2.5">
                      <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
                      </div>
                      <div className="ml-2 flex-1 rounded-lg bg-ink/5 px-3 py-1 text-[10px] text-muted">
                        padi.naub.edu.ng/browse/fcom
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-naub-teal to-naub-teal/80 px-4 py-3">
                        <Search size={16} className="text-white/70" />
                        <span className="text-xs text-white/50">Search courses, topics...</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {['FCOM', 'FAMSS', 'FENG', 'FNAS'].map((f) => (
                          <div
                            key={f}
                            className="rounded-lg border border-line bg-white p-3 text-center"
                          >
                            <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-army/5">
                              <span className="text-[9px] font-bold text-army">{f}</span>
                            </div>
                            <div className="h-1.5 w-12 mx-auto rounded bg-ink/5" />
                          </div>
                        ))}
                      </div>
                      <div className="rounded-lg border border-line bg-white p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 w-14 rounded bg-army/10 text-[8px] font-bold text-army flex items-center justify-center">
                            COS102
                          </div>
                          <div className="h-1.5 flex-1 rounded bg-ink/5" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1 w-full rounded bg-ink/5" />
                          <div className="h-1 w-3/4 rounded bg-ink/5" />
                          <div className="h-1 w-1/2 rounded bg-ink/5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative border-b border-line bg-white overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {[
              { value: '5', label: 'Faculties', accent: 'from-army to-army-700' },
              { value: '31', label: 'Departments', accent: 'from-naub-teal to-naub-teal/80' },
              { value: '10+', label: 'Sessions covered', accent: 'from-naub-gold to-marigold-600' },
            ].map(({ value, label, accent }) => (
              <div key={label} className="group text-center">
                <div className={`mx-auto mb-3 h-1 w-8 rounded-full bg-gradient-to-r ${accent} opacity-40 transition-all duration-300 group-hover:w-12 group-hover:opacity-80`} />
                <p
                  className="text-3xl font-bold text-ink md:text-4xl tabular-nums"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  {value}
                </p>
                <p className="mt-1.5 text-sm text-muted font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2
              className="text-3xl font-bold text-ink md:text-4xl"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              Everything you need to study
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              From searching past questions to uploading new papers — Padi handles it all.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:border-army/15 hover:shadow-card-hover hover:translate-y-[-2px]"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                >
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-ink" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                  {title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2
              className="text-3xl font-bold text-ink md:text-4xl"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              How it works
            </h2>
          </div>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="absolute left-1/6 right-1/6 top-12 hidden h-px bg-gradient-to-r from-army/20 via-naub-teal/20 to-naub-green/20 md:block" />

            {STEPS.map(({ step, icon: Icon, title, description, color }) => (
              <div key={step} className="relative text-center group">
                <div className="relative mx-auto mb-6">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                  >
                    <Icon size={26} strokeWidth={1.75} />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-paper border-2 border-line text-xs font-bold text-muted shadow-sm transition-all duration-300 group-hover:border-army/20 group-hover:text-army">
                    {step}
                  </span>
                </div>
                <h3
                  className="text-lg font-semibold text-ink"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  {title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed max-w-xs mx-auto">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculties */}
      <section className="bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <h2
              className="text-3xl font-bold text-ink md:text-4xl"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              Covered faculties
            </h2>
            <p className="mt-4 text-lg text-muted">
              Past questions from all five faculties at NAUB.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FACULTIES.map((faculty) => {
              const deptCount = getDepartmentsByFaculty(faculty.id).length;
              return (
                <Link
                  key={faculty.id}
                  href={`/browse/${faculty.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:border-army/15 hover:shadow-card-hover hover:translate-y-[-2px]"
                >
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-army/5 to-army/10 transition-all duration-300 group-hover:from-army group-hover:to-army/80 group-hover:shadow-glow-sm">
                    <span className="text-sm font-bold text-army transition-colors duration-300 group-hover:text-white">
                      {faculty.abbreviation}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-semibold text-ink truncate"
                      style={{ fontFamily: "'Lora', Georgia, serif" }}
                    >
                      {faculty.name}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {deptCount} {deptCount === 1 ? 'department' : 'departments'}
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    strokeWidth={2}
                    className="flex-shrink-0 text-muted/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-army"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-army py-20 lg:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/[0.04] blur-[80px]" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-naub-teal/10 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
            <GraduationCap size={32} strokeWidth={1.5} className="text-white/70" />
          </div>
          <h2
            className="text-3xl font-bold text-white md:text-4xl"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            Ready to ace your exams?
          </h2>
          <p className="mt-4 text-lg text-white/55">
            Join NAUB students using Padi to study smarter.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-army shadow-elevated transition-all hover:shadow-elevated-lg hover:translate-y-[-2px]"
            >
              Create free account
              <ArrowRight
                size={16}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Browse papers
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4">
                <Logo size="md" href="/" />
              </div>
              <p className="text-sm text-white/40 max-w-sm leading-relaxed">
                The past question bank for Nigerian Army University Biu. Built by students,
                for students.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-4">
                Quick links
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Browse papers', href: '/browse' },
                  { label: 'Flashcards', href: '/flashcards' },
                  { label: 'Upload', href: '/login?redirect=/upload' },
                  { label: 'Search', href: '/search' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-4">
                Account
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Sign in', href: '/login' },
                  { label: 'Register', href: '/register' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-xs text-white/25">
              &copy; {new Date().getFullYear()} Padi. Built for NAUB students.
            </p>
            <div className="flex items-center gap-4 text-xs text-white/25">
              <span>Nigerian Army University Biu</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
