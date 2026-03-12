import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { theme } from '@/constants/Colors';

const FEATURES = [
  { key: 'feature1', icon: '📝' },
  { key: 'feature2', icon: '🎨' },
  { key: 'feature3', icon: '🤖' },
  { key: 'feature4', icon: '📊' },
  { key: 'feature5', icon: '📄' },
];

export default function PaywallScreen() {
  const { t } = useTranslation();
  const { purchase, restore, isPurchasing, isRestoring } = useSubscriptionStore();

  const handleSubscribe = async () => {
    await purchase();
  };

  const handleRestore = async () => {
    await restore();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="✕" variant="ghost" onPress={() => router.back()} size="sm" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PRO</Text>
        </View>
        <Text style={styles.title}>{t('paywall.title')}</Text>
        <Text style={styles.subtitle}>{t('paywall.subtitle')}</Text>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.key} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{t(`paywall.${f.key}` as any)}</Text>
              <Text style={styles.check}>✓</Text>
            </View>
          ))}
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.price}>{t('paywall.price')}</Text>
          <Text style={styles.priceSub}>{t('paywall.cancelAnytime')}</Text>
        </View>

        <Button
          title={t('paywall.subscribe')}
          onPress={handleSubscribe}
          loading={isPurchasing}
          size="lg"
          style={{ marginTop: 24 }}
        />
        <Button
          title={t('paywall.restore')}
          variant="ghost"
          onPress={handleRestore}
          loading={isRestoring}
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.surface },
  header: { paddingTop: 56, paddingHorizontal: 16 },
  content: { padding: 32, alignItems: 'center' },
  badge: {
    backgroundColor: theme.secondary, borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 8, marginBottom: 20,
  },
  badgeText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 2 },
  title: { fontSize: 32, fontWeight: '800', color: theme.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.textSecondary, marginBottom: 32 },
  features: { width: '100%', gap: 16 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { fontSize: 24, width: 36, textAlign: 'center' },
  featureText: { flex: 1, fontSize: 16, color: theme.text },
  check: { fontSize: 18, color: theme.success, fontWeight: '700' },
  priceBox: {
    marginTop: 32, alignItems: 'center',
    backgroundColor: theme.primaryLight, borderRadius: 16,
    padding: 24, width: '100%',
  },
  price: { fontSize: 36, fontWeight: '800', color: theme.primary },
  priceSub: { fontSize: 14, color: theme.textSecondary, marginTop: 4 },
});
