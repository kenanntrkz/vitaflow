import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { theme } from '@/constants/Colors';

export default function RegisterScreen() {
  const { t, i18n } = useTranslation();
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    if (password.length < 8) {
      Alert.alert(t('common.error'), 'Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password, name.trim(), i18n.language);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>VitaFlow</Text>
          <Text style={styles.subtitle}>Create your account</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t('auth.name')}
            value={name}
            onChangeText={setName}
            autoComplete="name"
            placeholder="John Doe"
          />
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
            autoComplete="new-password"
            placeholder="Min. 8 characters"
          />
          <Button title={t('auth.register')} onPress={handleRegister} loading={loading} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.hasAccount')} </Text>
          <Link href="/(auth)/login" style={styles.link}>{t('auth.login')}</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  logo: { fontSize: 40, fontWeight: '800', color: theme.primary, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: theme.textSecondary, marginTop: 8 },
  form: { gap: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: theme.textSecondary, fontSize: 14 },
  link: { color: theme.primary, fontSize: 14, fontWeight: '600' },
});
