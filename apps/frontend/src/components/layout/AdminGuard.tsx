'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace('/login');
    } else if (user?.role !== 'admin') {
      router.replace('/');
    }
  }, [hydrated, token, user, router]);

  if (!hydrated || !token || user?.role !== 'admin') return null;
  return <>{children}</>;
}
