'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
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
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-army shadow-glow animate-float">
            <span className="text-2xl font-extrabold text-white">P</span>
          </div>
          <h1 className="text-display text-ink tracking-tight" style={{ fontFamily: "'Lora', Georgia, serif" }}>Welcome back</h1>
          <p className="mt-2 text-body text-muted">Sign in to your Padi account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-army-100 bg-army-50 px-4 py-3 text-sm text-army animate-fade-in">
              {error}
            </div>
          )}

          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
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

          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <label className="label">Password</label>
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

          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2">
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight size={16} strokeWidth={2} /></>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-muted animate-fade-in" style={{ animationDelay: '400ms' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="inline-flex items-center gap-1 font-semibold text-army transition-colors hover:text-army-700">
            Create one <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </p>
      </div>
    </div>
  );
}
