'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { api } from '@/lib/api';
import { Logo } from '@/components/ui/Logo';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.register(name, email, password);
      setAuth(data.access_token, data.user as any);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
            Create an account
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted">Join Padi to access & upload past questions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-army-100 bg-army-50 px-4 py-3 text-sm text-army animate-fade-in">
              {error}
            </div>
          )}

          <div>
            <label className="label">Full name</label>
            <div className="relative">
              <User size={16} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="input-field pl-11"
              />
            </div>
          </div>

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
            <label className="label">Password</label>
            <div className="relative">
              <Lock size={16} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="input-field pl-11"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 mt-2">
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Creating account...</>
            ) : (
              <>Create account <ArrowRight size={16} strokeWidth={2} /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-army transition-colors hover:text-army-700">
            Sign in <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </p>
      </div>
    </div>
  );
}
