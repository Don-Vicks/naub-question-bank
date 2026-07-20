'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, LogIn, UserPlus, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthGuard({
  children,
  title = 'Sign in required',
  description = 'You must be signed in to access this feature on Padi.',
}: AuthGuardProps) {
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-army border-t-transparent" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="page-desktop flex min-h-[75vh] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-card-xl border border-line bg-white p-8 shadow-card text-center animate-fade-in-up">
          {/* Header Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-army-50 border border-army/15 text-army shadow-glow-sm">
            <ShieldAlert size={30} strokeWidth={1.75} />
          </div>

          {/* Title & Description */}
          <h2
            className="text-2xl font-bold text-ink tracking-tight"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
          >
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            {description}
          </p>

          {/* Action buttons */}
          <div className="mt-8 space-y-3">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="btn-primary flex w-full items-center justify-center gap-2 text-sm py-3.5"
            >
              <LogIn size={16} strokeWidth={2} />
              Sign in to your account
            </Link>

            <Link
              href="/register"
              className="btn-secondary flex w-full items-center justify-center gap-2 text-sm py-3.5"
            >
              <UserPlus size={16} strokeWidth={2} />
              Create a new account
            </Link>
          </div>

          {/* Secondary Link */}
          <div className="mt-6 border-t border-line-light pt-5">
            <Link
              href="/browse"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-army transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={2} />
              Return to Browse Papers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
