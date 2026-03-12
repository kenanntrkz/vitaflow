import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getTemplates } from '@/services/templates';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/Colors';
import type { Template } from '@/types/resume';

const TEMPLATE_COLORS: Record<string, string> = {
  'modern-blue': '#2563EB',
  'classic': '#374151',
  'minimal': '#6B7280',
  'executive': '#1E293B',
  'creative': '#7C3AED',
  'tech-pro': '#0EA5E9',
  'academic': '#78350F',
  'elegant': '#B45309',
  'bold': '#111111',
  'two-column': '#2563EB',
};

export default function TemplatesScreen() {
  const { t } = useTranslation();
  const isPremium = useAuthStore((s) => s.user?.is_premium);
  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: getTemplates,
  });

  const handleSelect = (template: Template) => {
    if (template.is_premium && !isPremium) {
      router.push('/paywall');
      return;
    }
    router.push({ pathname: '/cv/new', params: { templateId: template.id.toString() } });
  };

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={theme.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Card onPress={() => handleSelect(item)} style={styles.card}>
            <View style={[styles.preview, { backgroundColor: TEMPLATE_COLORS[item.slug] || theme.primary }]}>
              <Text style={styles.previewText}>{item.name.charAt(0)}</Text>
              {item.is_premium && !isPremium && (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockText}>PRO</Text>
                </View>
              )}
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.badge}>
              {item.is_premium ? t('templates.premium') : t('templates.free')}
            </Text>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  grid: { padding: 12 },
  row: { gap: 12, marginBottom: 12 },
  card: { flex: 1, padding: 12 },
  preview: {
    height: 140, borderRadius: 8, justifyContent: 'center', alignItems: 'center',
    marginBottom: 10,
  },
  previewText: { fontSize: 36, fontWeight: '800', color: 'rgba(255,255,255,0.3)' },
  lockBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: theme.secondary, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
  },
  lockText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  name: { fontSize: 14, fontWeight: '600', color: theme.text },
  badge: { fontSize: 11, color: theme.textSecondary, marginTop: 2 },
});
