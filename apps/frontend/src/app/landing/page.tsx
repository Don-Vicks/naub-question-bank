'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Search,
  Upload,
  BookOpen,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Check,
  GraduationCap,
  FileText,
  Sparkles,
  Brain,
  Target,
  Clock,
  ChevronRight,
  Star,
  Layers,
} from 'lucide-react';
import { FACULTIES, getDepartmentsByFaculty } from '@/lib/naub-data';

function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

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
    description: 'Snap a photo or upload a PDF — our AI handles splitting and extraction.',
    color: 'bg-army-50 text-army',
  },
  {
    icon: Brain,
    title: 'AI-Powered',
    description: 'Questions are split, classified, and answered using advanced AI models.',
    color: 'bg-naub-gold-light text-naub-gold',
  },
  {
    icon: Layers,
    title: 'Flashcards & OBJ',
    description: 'Study with interactive flip cards and multiple choice quizzes for any course.',
    color: 'bg-naub-green-light text-naub-green',
  },
  {
    icon: Shield,
    title: 'Verified Answers',
    description: 'Community-reviewed answers with confidence ratings you can trust.',
    color: 'bg-naub-teal/10 text-naub-teal',
  },
  {
    icon: Target,
    title: 'Practice Mode',
    description: 'Timed quizzes with score tracking to test your knowledge before exams.',
    color: 'bg-army-50 text-army',
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
    icon: Brain,
    title: 'AI processes them',
    description: 'Our pipeline splits pages, extracts questions, and generates verified answers.',
    color: 'from-naub-teal to-naub-teal/80',
  },
  {
    step: '03',
    icon: BookOpen,
    title: 'Study & practice',
    description: 'Browse by faculty, use flashcards, or take timed practice quizzes.',
    color: 'from-naub-green to-naub-green/80',
  },
];

const TESTIMONIALS = [
  {
    name: 'Abdulrahman K.',
    faculty: 'FCOM — Computer Science',
    text: 'Padi saved me during exam prep. I found past questions for COS201 in seconds and the flashcards helped me revise between lectures.',
    rating: 5,
  },
  {
    name: 'Fatima B.',
    faculty: 'FAMSS — Accounting',
    text: 'The AI answers are surprisingly accurate. I cross-check with my textbooks and it\'s spot on most times. Best study tool at NAUB.',
    rating: 5,
  },
  {
    name: 'Ibrahim M.',
    faculty: 'FENG — Mechanical Engineering',
    text: 'Uploading my department\'s past papers was so easy. Now everyone in my class can access them. This is what NAUB needed.',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-army">
        {/* Decorative blurs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-white/[0.04] blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-naub-teal/10 blur-[80px]" />
          <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-white/[0.02] blur-[60px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-0">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-16 lg:mb-24">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm shadow-glow-sm">
                <span className="text-lg font-extrabold text-white">P</span>
              </div>
              <span
                className="text-xl font-extrabold text-white tracking-tight"
                style={{ fontFamily: "'Lora', Georgia, serif" }}
              >
                Padi
              </span>
            </div>
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
                Padi collects, organizes, and AI-enhances past exam papers from every faculty
                at NAUB. Study smarter, not harder.
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
                <span className="flex items-center gap-1.5">
                  <Check size={12} strokeWidth={2.5} className="text-naub-green" />
                  Open source
                </span>
              </div>
            </div>

            {/* Device mockup */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Glow behind */}
                <div className="absolute -inset-8 rounded-3xl bg-white/[0.03] blur-2xl" />
                {/* Device frame */}
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur-xl shadow-2xl">
                  <div className="rounded-xl bg-paper overflow-hidden">
                    {/* Browser chrome */}
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
                    {/* Content mockup */}
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
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: 5, label: 'Faculties', suffix: '' },
              { value: 31, label: 'Departments', suffix: '' },
              { value: 2146, label: 'Papers', suffix: '+' },
              { value: 10, label: 'Sessions', suffix: '+' },
            ].map(({ value, label, suffix }) => (
              <div key={label} className="text-center">
                <p
                  className="text-3xl font-bold text-ink md:text-4xl"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  <AnimatedCounter end={value} suffix={suffix} />
                </p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-paper py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-army/5 px-3 py-1 text-xs font-semibold text-army">
              <Zap size={12} strokeWidth={2.5} />
              Features
            </span>
            <h2
              className="text-3xl font-bold text-ink md:text-4xl"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              Everything you need to ace your exams
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              From searching past questions to uploading new papers — Padi handles it all.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="group rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:border-army/15 hover:shadow-card-hover hover:translate-y-[-2px]"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${color} transition-transform duration-300 group-hover:scale-110`}
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
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-naub-teal/10 px-3 py-1 text-xs font-semibold text-naub-teal">
              <Clock size={12} strokeWidth={2.5} />
              How it works
            </span>
            <h2
              className="text-3xl font-bold text-ink md:text-4xl"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              Three steps to better grades
            </h2>
          </div>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Connecting line (desktop) */}
            <div className="absolute left-1/6 right-1/6 top-12 hidden h-px bg-gradient-to-r from-army/20 via-naub-teal/20 to-naub-green/20 md:block" />

            {STEPS.map(({ step, icon: Icon, title, description, color }) => (
              <div key={step} className="relative text-center">
                <div className="relative mx-auto mb-6">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}
                  >
                    <Icon size={26} strokeWidth={1.75} />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-paper border-2 border-line text-xs font-bold text-muted">
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
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-naub-green-light px-3 py-1 text-xs font-semibold text-naub-green">
              <GraduationCap size={12} strokeWidth={2.5} />
              Coverage
            </span>
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

      {/* Testimonials */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-naub-gold-light px-3 py-1 text-xs font-semibold text-naub-gold">
              <Star size={12} strokeWidth={2.5} />
              Testimonials
            </span>
            <h2
              className="text-3xl font-bold text-ink md:text-4xl"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              Loved by NAUB students
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:shadow-card-hover"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="text-naub-gold" />
                  ))}
                </div>
                <p className="text-sm text-ink leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="border-t border-line pt-4">
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-muted mt-0.5">{t.faculty}</p>
                </div>
              </div>
            ))}
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
          <GraduationCap size={48} strokeWidth={1.5} className="mx-auto mb-6 text-white/25" />
          <h2
            className="text-3xl font-bold text-white md:text-4xl"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            Ready to ace your exams?
          </h2>
          <p className="mt-4 text-lg text-white/55">
            Join thousands of NAUB students using Padi to study smarter.
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
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <span className="text-sm font-extrabold text-white">P</span>
                </div>
                <span
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Lora', Georgia, serif" }}
                >
                  Padi
                </span>
              </div>
              <p className="text-sm text-white/40 max-w-sm leading-relaxed">
                The official question bank for Nigerian Army University Biu. Built by students,
                for students.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-4">
                Quick links
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Browse papers', href: '/browse' },
                  { label: 'Flashcards', href: '/flashcards' },
                  { label: 'Upload', href: '/upload' },
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

            {/* Account */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-4">
                Account
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Sign in', href: '/login' },
                  { label: 'Register', href: '/register' },
                  { label: 'Profile', href: '/profile' },
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
              <span className="text-white/10">|</span>
              <span>Africa&apos;s First Green University</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
