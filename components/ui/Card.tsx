import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { theme, radius } from '@/constants/Colors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({ children, onPress, style, variant = 'default' }: CardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={[styles.card, variantStyles[variant], style]}
      {...(onPress ? { onPress, activeOpacity: 0.85 } : {})}
    >
      {children}
    </Wrapper>
  );
}

const variantStyles: Record<string, ViewStyle> = {
  default: {
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.border,
    elevation: 0,
  },
  elevated: {
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: radius.lg,
    padding: 16,
  },
});
