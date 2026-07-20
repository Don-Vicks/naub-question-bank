'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { api } from '@/lib/api';
import { Logo } from '@/components/ui/Logo';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') ?? '/';
  const noticeMessage = searchParams.get('message');

  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(email, password);
      setAuth(data.access_token, data.user as any);
      router.push(redirectTarget);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-desktop flex min-h-[85vh] items-center justify-center p-4 sm:p-6 pb-28 md:py-12">
      <div className="card-elevated w-full max-w-md rounded-card-xl p-6 sm:p-8 shadow-card animate-fade-in-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold text-ink tracking-tight" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            Welcome back
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted">Sign in to your Padi account</p>
        </div>

        {noticeMessage && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-naub-teal/20 bg-naub-teal/10 px-4 py-3 text-xs text-naub-teal animate-fade-in">
            <Info size={16} className="mt-0.5 flex-shrink-0" />
            <span>{noticeMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-army-100 bg-army-50 px-4 py-3 text-sm text-army animate-fade-in">
              {error}
            </div>
          )}

          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail size={16} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="you@naub.edu.ng"
                className="input-field pl-11"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-army transition-colors hover:text-army-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="input-field pl-11"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 mt-2">
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Signing in...</>
            ) : (
              <>Sign in <ArrowRight size={16} strokeWidth={2} /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="inline-flex items-center gap-1 font-semibold text-army transition-colors hover:text-army-700">
            Create one <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[85vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-army border-t-transparent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
