import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';
import { theme } from '@/constants/Colors';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert(t('settings.logout'), t('common.confirm') + '?', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.logout'),
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {user?.is_premium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
      </Card>

      {!user?.is_premium && (
        <Card onPress={() => router.push('/paywall')} style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>{t('settings.upgrade')}</Text>
          <Text style={styles.upgradeDesc}>{t('paywall.subtitle')}</Text>
          <Text style={styles.upgradeArrow}>›</Text>
        </Card>
      )}

      <View style={styles.section}>
        <SettingRow
          label={t('settings.language')}
          value={i18n.language === 'en' ? 'English' : 'Turkce'}
          onPress={toggleLanguage}
        />
      </View>

      <View style={styles.section}>
        <SettingRow label={t('settings.logout')} onPress={handleLogout} danger />
      </View>

      <Text style={styles.version}>{t('settings.version')} 1.0.0</Text>
    </ScrollView>
  );
}

function SettingRow({ label, value, onPress, danger }: {
  label: string; value?: string; onPress: () => void; danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.rowLabel, danger && { color: theme.error }]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      <Text style={styles.rowArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 16 },
  profileCard: { alignItems: 'center', padding: 24, marginBottom: 16 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: theme.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: theme.primary },
  name: { fontSize: 20, fontWeight: '700', color: theme.text, marginTop: 12 },
  email: { fontSize: 14, color: theme.textSecondary, marginTop: 4 },
  premiumBadge: {
    backgroundColor: theme.secondary, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 4, marginTop: 8,
  },
  premiumText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  upgradeCard: {
    backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center',
    padding: 20, marginBottom: 16,
  },
  upgradeTitle: { color: '#fff', fontSize: 16, fontWeight: '700', flex: 1 },
  upgradeDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  upgradeArrow: { color: '#fff', fontSize: 24, marginLeft: 8 },
  section: {
    backgroundColor: theme.surface, borderRadius: 16,
    marginBottom: 16, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 0.5, borderBottomColor: theme.border,
  },
  rowLabel: { flex: 1, fontSize: 16, color: theme.text },
  rowValue: { fontSize: 14, color: theme.textSecondary, marginRight: 8 },
  rowArrow: { fontSize: 20, color: theme.textTertiary },
  version: { textAlign: 'center', color: theme.textTertiary, fontSize: 12, marginTop: 24 },
});
