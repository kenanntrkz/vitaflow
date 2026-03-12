export const theme = {
  // Brand
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  primaryGhost: '#EFF6FF',
  secondary: '#7C3AED',
  secondaryLight: '#EDE9FE',
  accent: '#0EA5E9',

  // Backgrounds
  background: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',

  // Text
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#F1F5F9',

  // Status
  error: '#EF4444',
  errorLight: '#FEF2F2',
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',

  // Shadows
  shadowColor: '#0F172A',

  // Gradients (reference values — applied via LinearGradient)
  gradientStart: '#2563EB',
  gradientEnd: '#7C3AED',
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

// Border radius scale
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

// Font sizes
export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  hero: 32,
  display: 40,
} as const;

export default {
  light: {
    text: theme.text,
    background: theme.background,
    tint: theme.primary,
    tabIconDefault: theme.textTertiary,
    tabIconSelected: theme.primary,
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F172A',
    tint: '#60A5FA',
    tabIconDefault: '#64748B',
    tabIconSelected: '#60A5FA',
  },
};
