export const theme = {
  primary: '#2563EB',
  primaryLight: '#DBEAFE',
  secondary: '#7C3AED',
  secondaryLight: '#EDE9FE',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  border: '#E2E8F0',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

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
