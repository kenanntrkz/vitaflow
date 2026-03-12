import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { theme, spacing, radius } from '@/constants/Colors';

const FEATURES = [
  { key: 'feature1', icon: '📝', color: '#2563EB' },
  { key: 'feature2', icon: '🎨', color: '#7C3AED' },
  { key: 'feature3', icon: '🤖', color: '#0EA5E9' },
  { key: 'feature4', icon: '📊', color: '#10B981' },
  { key: 'feature5', icon: '📄', color: '#F59E0B' },
];

export default function PaywallScreen() {
  const { t } = useTranslation();
  const { purchase, restore, isPurchasing, isRestoring } = useSubscriptionStore();

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <View style={styles.header}>
        <Button title="✕" variant="ghost" onPress={() => router.back()} size="sm" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Crown + Badge */}
        <View style={styles.crown}>
          <Text style={styles.crownEmoji}>👑</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PRO</Text>
        </View>
        <Text style={styles.title}>{t('paywall.title')}</Text>
        <Text style={styles.subtitle}>{t('paywall.subtitle')}</Text>

        {/* Features */}
        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.key} style={styles.featureRow}>
              <View style={[styles.featureIconBox, { backgroundColor: f.color + '12' }]}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
              </View>
              <Text style={styles.featureText}>{t(`paywall.${f.key}` as any)}</Text>
              <View style={styles.checkCircle}>
                <Text style={styles.check}>✓</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Price Card */}
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>{t('paywall.monthlyPlan') || 'Monthly Plan'}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceCurrency}>$</Text>
            <Text style={styles.priceAmount}>4</Text>
            <View>
              <Text style={styles.priceCents}>.99</Text>
              <Text style={styles.pricePeriod}>/mo</Text>
            </View>
          </View>
          <Text style={styles.priceSub}>{t('paywall.cancelAnytime')}</Text>
        </View>

        {/* Actions */}
        <Button
          title={t('paywall.subscribe')}
          onPress={() => purchase()}
          loading={isPurchasing}
          size="lg"
          fullWidth
          style={{ marginTop: 24 }}
        />
        <Button
          title={t('paywall.restore')}
          variant="ghost"
          onPress={() => restore()}
          loading={isRestoring}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.surface },
  header: { paddingTop: 56, paddingHorizontal: 16, alignItems: 'flex-start' },
  content: { padding: 32, alignItems: 'center' },

  crown: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  crownEmoji: { fontSize: 32 },

  badge: {
    backgroundColor: theme.secondary, borderRadius: radius.sm,
    paddingHorizontal: 16, paddingVertical: 6, marginBottom: 16,
    shadowColor: theme.secondary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  badgeText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 3 },

  title: { fontSize: 28, fontWeight: '800', color: theme.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: theme.textSecondary, marginTop: 6, marginBottom: 28, textAlign: 'center' },

  features: { width: '100%', gap: 12 },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: theme.background, borderRadius: radius.md,
    padding: 14,
  },
  featureIconBox: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  featureIcon: { fontSize: 20 },
  featureText: { flex: 1, fontSize: 15, color: theme.text, fontWeight: '500' },
  checkCircle: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: theme.successLight, justifyContent: 'center', alignItems: 'center',
  },
  check: { fontSize: 13, color: theme.success, fontWeight: '700' },

  priceCard: {
    marginTop: 28, alignItems: 'center',
    backgroundColor: theme.primaryGhost, borderRadius: radius.xl,
    padding: 24, width: '100%',
    borderWidth: 2, borderColor: theme.primary,
  },
  priceLabel: { fontSize: 13, fontWeight: '600', color: theme.textSecondary, letterSpacing: 0.5 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  priceCurrency: { fontSize: 20, fontWeight: '700', color: theme.primary, marginTop: 4 },
  priceAmount: { fontSize: 48, fontWeight: '800', color: theme.primary, lineHeight: 52 },
  priceCents: { fontSize: 20, fontWeight: '700', color: theme.primary, marginTop: 4 },
  pricePeriod: { fontSize: 13, color: theme.textSecondary, fontWeight: '500' },
  priceSub: { fontSize: 13, color: theme.textTertiary, marginTop: 6 },
});
