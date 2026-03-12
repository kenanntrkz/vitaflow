import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { theme, radius } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', loading, disabled, icon, style, fullWidth }: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyle: ViewStyle[] = [
    styles.base,
    variantStyles[variant],
    sizeStyles[size],
    isDisabled && styles.disabled,
    fullWidth && { width: '100%' } as ViewStyle,
    style as ViewStyle,
  ];

  const textColor = textColors[variant];
  const textStyle: TextStyle = {
    ...styles.text,
    ...textSizeStyles[size],
    color: textColor,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon}
          <Text style={textStyle}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const textColors: Record<string, string> = {
  primary: '#FFFFFF',
  secondary: '#FFFFFF',
  outline: theme.primary,
  ghost: theme.primary,
  danger: theme.error,
};

const variantStyles: Record<string, ViewStyle> = {
  primary: {
    backgroundColor: theme.primary,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    backgroundColor: theme.secondary,
    shadowColor: theme.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: theme.errorLight,
  },
};

const sizeStyles: Record<string, ViewStyle> = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: radius.sm },
  md: { paddingVertical: 13, paddingHorizontal: 22, borderRadius: radius.md },
  lg: { paddingVertical: 16, paddingHorizontal: 28, borderRadius: radius.md },
};

const textSizeStyles: Record<string, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabled: { opacity: 0.5 },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
