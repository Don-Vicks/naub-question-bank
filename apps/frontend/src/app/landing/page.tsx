'use client';

import Link from 'next/link';
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
} from 'lucide-react';
import { FACULTIES } from '@/lib/naub-data';

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find past questions by course code, topic, or faculty instantly.',
  },
  {
    icon: Upload,
    title: 'Easy Upload',
    description: 'Upload PDFs or images — our AI extracts and organizes questions automatically.',
  },
  {
    icon: Zap,
    title: 'AI-Powered',
    description: 'Questions are split, classified, and answered using advanced AI models.',
  },
  {
    icon: Shield,
    title: 'Verified Content',
    description: 'Community-reviewed answers with confidence ratings you can trust.',
  },
];

const STATS = [
  { value: '5', label: 'Faculties' },
  { value: '31', label: 'Departments' },
  { value: '2,146+', label: 'Papers' },
  { value: '10+', label: 'Sessions' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-army">
        <div className="absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-naub-teal/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="text-lg font-extrabold text-white">P</span>
              </div>
              <span className="text-xl font-extrabold text-white" style={{ fontFamily: "'Lora', Georgia, serif" }}>
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

          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <Sparkles size={12} strokeWidth={2} />
              Nigerian Army University Biu
            </div>
            <h1
              className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              Your past questions,
              <br />
              <span className="text-white/80">organized and ready.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/60">
              Padi collects, organizes, and AI-enhances past exam papers from every faculty
              at NAUB. Study smarter, not harder.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-semibold text-army shadow-elevated transition-all hover:shadow-elevated-lg hover:translate-y-[-2px]"
              >
                Start studying
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Browse as guest
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-ink md:text-3xl" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                  {value}
                </p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-army-50">
                  <Icon size={22} strokeWidth={1.75} className="text-army" />
                </div>
                <h3 className="text-heading text-ink">{title}</h3>
                <p className="mt-2 text-caption text-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-ink md:text-4xl"
              style={{ fontFamily: "'Lora', Georgia, serif" }}
            >
              How Padi works
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Upload papers',
                description: 'Upload PDFs or photos of past exam questions from any faculty.',
              },
              {
                step: '02',
                icon: Zap,
                title: 'AI processes them',
                description: 'Our AI splits questions, extracts text, and generates verified answers.',
              },
              {
                step: '03',
                icon: BookOpen,
                title: 'Study & practice',
                description: 'Browse by faculty, department, or course. Practice with timed quizzes.',
              },
            ].map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="relative">
                <div className="mb-4 text-5xl font-bold text-army/10" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                  {step}
                </div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-naub-teal/10">
                  <Icon size={20} strokeWidth={1.75} className="text-naub-teal" />
                </div>
                <h3 className="text-heading text-ink">{title}</h3>
                <p className="mt-2 text-caption text-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculties */}
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
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
            {FACULTIES.map((faculty) => (
              <Link
                key={faculty.id}
                href={`/browse/${faculty.id}`}
                className="card-interactive group flex items-center gap-4 p-5"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-army/5 to-army/10 transition-all duration-300 group-hover:from-army group-hover:to-army/80">
                  <span className="text-xs font-bold text-army transition-colors group-hover:text-white">
                    {faculty.abbreviation}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-heading text-ink truncate">{faculty.name}</p>
                </div>
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="text-muted/30 transition-all group-hover:translate-x-1 group-hover:text-army"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-army py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <GraduationCap size={48} strokeWidth={1.5} className="mx-auto mb-6 text-white/30" />
          <h2
            className="text-3xl font-bold text-white md:text-4xl"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            Ready to ace your exams?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Join thousands of NAUB students using Padi to study smarter.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-army shadow-elevated transition-all hover:shadow-elevated-lg hover:translate-y-[-2px]"
            >
              Create free account
              <ArrowRight size={16} strokeWidth={2} />
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
      <footer className="bg-ink py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <span className="text-sm font-extrabold text-white">P</span>
              </div>
              <span className="text-sm font-bold text-white/70" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                Padi — NAUB Question Bank
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/40">
              <span>Nigerian Army University Biu</span>
              <span>·</span>
              <span>Africa&apos;s First Green University</span>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
            &copy; {new Date().getFullYear()} Padi. Built for NAUB students.
          </div>
        </div>
      </footer>
    </div>
  );
}
