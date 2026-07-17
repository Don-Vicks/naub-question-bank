import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, type User } from '@/lib/auth-store';

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setAuthStore = useAuthStore((s) => s.setAuth);
  const logoutStore = useAuthStore((s) => s.logout);

  const setAuth = useCallback(
    (newToken: string, newUser: User) => {
      setAuthStore(newToken, newUser);
    },
    [setAuthStore],
  );

  const logout = useCallback(() => {
    logoutStore();
    router.replace('/login');
  }, [logoutStore, router]);

  return useMemo(
    () => ({
      user,
      token,
      hydrated,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin',
      setAuth,
      logout,
    }),
    [user, token, hydrated, setAuth, logout],
  );
}
