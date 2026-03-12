import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';
import { theme, spacing, radius } from '@/constants/Colors';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('settings.logout') + '?')) {
        await logout();
        router.replace('/(auth)/login');
      }
    } else {
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
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <Card variant="elevated" style={styles.profileCard}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || '?'}</Text>
          </View>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {user?.is_premium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PRO</Text>
          </View>
        )}
      </Card>

      {/* Upgrade CTA */}
      {!user?.is_premium && (
        <TouchableOpacity style={styles.upgradeCard} onPress={() => router.push('/paywall')} activeOpacity={0.85}>
          <View style={styles.upgradeLeft}>
            <Text style={styles.upgradeEmoji}>👑</Text>
            <View>
              <Text style={styles.upgradeTitle}>{t('settings.upgrade')}</Text>
              <Text style={styles.upgradeDesc}>{t('paywall.subtitle')}</Text>
            </View>
          </View>
          <Text style={styles.upgradeArrow}>›</Text>
        </TouchableOpacity>
      )}

      {/* Settings Sections */}
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
      <Text style={[styles.rowLabel, danger && { color: theme.error, fontWeight: '600' }]}>{label}</Text>
      {value && (
        <View style={styles.rowValueBox}>
          <Text style={styles.rowValue}>{value}</Text>
        </View>
      )}
      <Text style={styles.rowArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20, paddingTop: 60 },

  profileCard: { alignItems: 'center', padding: 28, marginBottom: 16 },
  avatarRing: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 3, borderColor: theme.primary + '30',
    justifyContent: 'center', alignItems: 'center',
  },
  avatar: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: theme.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 26, fontWeight: '800', color: theme.primary },
  name: { fontSize: 20, fontWeight: '800', color: theme.text, marginTop: 14, letterSpacing: -0.3 },
  email: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
  premiumBadge: {
    backgroundColor: theme.secondary, borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 3, marginTop: 10,
  },
  premiumText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 2 },

  upgradeCard: {
    backgroundColor: theme.primary, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: 18, borderRadius: radius.lg, marginBottom: 16,
    shadowColor: theme.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  upgradeLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  upgradeEmoji: { fontSize: 24 },
  upgradeTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  upgradeDesc: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  upgradeArrow: { color: '#fff', fontSize: 24 },

  section: {
    backgroundColor: theme.surface, borderRadius: radius.lg,
    marginBottom: 12, overflow: 'hidden',
    shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 0.5, borderBottomColor: theme.borderLight,
  },
  rowLabel: { flex: 1, fontSize: 15, color: theme.text, fontWeight: '500' },
  rowValueBox: {
    backgroundColor: theme.background, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  rowValue: { fontSize: 13, color: theme.textSecondary, fontWeight: '500' },
  rowArrow: { fontSize: 20, color: theme.textTertiary, marginLeft: 8 },
  version: { textAlign: 'center', color: theme.textTertiary, fontSize: 12, marginTop: 24, fontWeight: '500' },
});
