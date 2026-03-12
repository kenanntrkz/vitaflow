import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { loadToken } from '@/services/api';
import * as authService from '@/services/auth';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, locale?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { user } = await authService.login(email, password);
    set({ user, isAuthenticated: true });
  },

  register: async (email, password, name, locale) => {
    const { user } = await authService.register(email, password, name, locale);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  loadSession: async () => {
    try {
      await loadToken();
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        const user = await authService.getProfile();
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (partial) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : null,
    }));
  },
}));
