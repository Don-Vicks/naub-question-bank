'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    } else if (user?.role !== 'admin') {
      router.replace('/');
    }
  }, [token, user, router]);

  if (!token || user?.role !== 'admin') return null;
  return <>{children}</>;
}
