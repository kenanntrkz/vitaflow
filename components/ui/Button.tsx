import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', loading, disabled, icon, style }: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : theme.primary} size="small" />
      ) : (
        <>
          {icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
  primary: {
    backgroundColor: theme.primary,
  },
  secondary: {
    backgroundColor: theme.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  size_sm: { paddingVertical: 8, paddingHorizontal: 16 },
  size_md: { paddingVertical: 14, paddingHorizontal: 24 },
  size_lg: { paddingVertical: 18, paddingHorizontal: 32 },
  disabled: { opacity: 0.5 },
  text: { fontWeight: '600' },
  text_primary: { color: '#FFFFFF' },
  text_secondary: { color: '#FFFFFF' },
  text_outline: { color: theme.primary },
  text_ghost: { color: theme.primary },
  textSize_sm: { fontSize: 14 },
  textSize_md: { fontSize: 16 },
  textSize_lg: { fontSize: 18 },
});
