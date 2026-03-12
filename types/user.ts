export interface User {
  id: number;
  email: string;
  name: string;
  is_premium: boolean;
  premium_expires_at: string | null;
  locale: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
