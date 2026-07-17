import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hydrated: false,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      isAdmin: () => get().user?.role === 'admin',
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'padi-auth',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (_state, _error) => {
        // Zustand calls this after rehydrating from localStorage.
        // We use a microtask to ensure the store update happens
        // after the initial render cycle.
        queueMicrotask(() => {
          useAuthStore.setState({ hydrated: true });
        });
      },
    },
  ),
);
