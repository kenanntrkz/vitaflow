import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { theme, spacing } from '@/constants/Colors';

export default function LoginScreen() {
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Brand */}
        <View style={styles.brandArea}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>V</Text>
          </View>
          <Text style={styles.logo}>VitaFlow</Text>
          <Text style={styles.subtitle}>{t('auth.loginSubtitle') || 'AI-Powered Resume Builder'}</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="you@example.com"
          />
          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            placeholder="••••••••"
          />
          <Button
            title={t('auth.login')}
            onPress={handleLogin}
            loading={loading}
            size="lg"
            fullWidth
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.noAccount')} </Text>
          <Link href="/(auth)/register" style={styles.link}>{t('auth.register')}</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl },

  brandArea: { alignItems: 'center', marginBottom: 40 },
  logoIcon: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
    shadowColor: theme.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  logoIconText: { fontSize: 28, fontWeight: '800', color: '#fff' },
  logo: { fontSize: 32, fontWeight: '800', color: theme.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: theme.textSecondary, marginTop: 6 },

  formCard: {
    backgroundColor: theme.surface, borderRadius: 20, padding: 24,
    shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 16, elevation: 3,
  },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: theme.textSecondary, fontSize: 14 },
  link: { color: theme.primary, fontSize: 14, fontWeight: '700' },
});
