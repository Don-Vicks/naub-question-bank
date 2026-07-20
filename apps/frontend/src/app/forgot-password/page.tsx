'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.forgotPassword(email.trim());
      setMessage(res.message);
      setSubmitted(true);
    } catch (err: unknown) {
      // Fallback response for offline or server errors
      setMessage('If an account exists with that email address, password reset instructions have been sent.');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-desktop flex min-h-[85vh] items-center justify-center p-4 sm:p-6 pb-28 md:py-12">
      <div className="card-elevated w-full max-w-md rounded-card-xl p-6 sm:p-8 shadow-card animate-fade-in-up">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold text-ink tracking-tight" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            Reset Password
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted">
            Enter your account email to receive reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-4 space-y-4 animate-fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-naub-green-light text-naub-green border border-naub-green/20">
              <CheckCircle2 size={32} strokeWidth={2} />
            </div>
            <div>
              <p className="text-base font-semibold text-ink">Instructions Sent!</p>
              <p className="mt-1.5 text-xs text-muted leading-relaxed max-w-xs mx-auto">
                {message}
              </p>
            </div>
            <Link
              href="/login"
              className="btn-primary w-full inline-flex items-center justify-center gap-2 mt-4 text-xs py-3"
            >
              <ArrowLeft size={14} strokeWidth={2} />
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-2xl border border-army-100 bg-army-50 px-4 py-3 text-sm text-army animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <label className="label">Registered Email</label>
              <div className="relative">
                <Mail size={16} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@naub.edu.ng"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="btn-primary flex w-full items-center justify-center gap-2 mt-2 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending instructions...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>
        )}

        <div className="mt-6 border-t border-line-light pt-5 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-army transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
