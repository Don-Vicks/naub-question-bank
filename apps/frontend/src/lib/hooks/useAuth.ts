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
  updateUser: (partialUser: Partial<User>) => void;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const setAuthStore = useAuthStore((s) => s.setAuth);
  const updateUserStore = useAuthStore((s) => s.updateUser);
  const logoutStore = useAuthStore((s) => s.logout);

  const setAuth = useCallback(
    (newToken: string, newUser: User) => {
      setAuthStore(newToken, newUser);
    },
    [setAuthStore],
  );

  const updateUser = useCallback(
    (partialUser: Partial<User>) => {
      updateUserStore(partialUser);
    },
    [updateUserStore],
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
      updateUser,
      logout,
    }),
    [user, token, hydrated, setAuth, updateUser, logout],
  );
}
