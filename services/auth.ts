import { api, setTokens, clearTokens } from './api';
import type { AuthResponse, User } from '@/types/user';

export async function register(email: string, password: string, name: string, locale: string = 'en'): Promise<AuthResponse> {
  const data = await api<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, locale }),
  });
  await setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await setTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function logout(): Promise<void> {
  await clearTokens();
}

export async function getProfile(): Promise<User> {
  const data = await api<{ user: User }>('/users/me');
  return data.user;
}
