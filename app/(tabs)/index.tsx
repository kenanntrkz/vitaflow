import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getResumes } from '@/services/resumes';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { canCreateResume } from '@/stores/subscriptionStore';
import { theme, spacing, radius } from '@/constants/Colors';
import { timeAgo } from '@/utils/formatDate';
import type { Resume } from '@/types/resume';

const ACCENT_COLORS = ['#2563EB', '#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

export default function DashboardScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const isPremium = user?.is_premium;
  const { data: resumes, isLoading, refetch } = useQuery({
    queryKey: ['resumes'],
    queryFn: getResumes,
  });

  const handleCreate = () => {
    if (!canCreateResume(resumes?.length || 0, !!isPremium)) {
      router.push('/paywall');
      return;
    }
    router.push('/cv/new');
  };

  const handleOpen = (resume: Resume) => {
    router.push(`/cv/${resume.id}/edit`);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Hero Header */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.greeting}>{t('dashboard.hello') || 'Hello'},</Text>
            <Text style={styles.userName}>{user?.name || 'there'}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || '?'}</Text>
          </View>
        </View>
        <Button
          title={`+  ${t('dashboard.createNew')}`}
          onPress={handleCreate}
          size="lg"
          fullWidth
          style={{ marginTop: 20 }}
        />
      </View>

      {!resumes?.length ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconBox}>
            <Text style={styles.emptyIcon}>📄</Text>
          </View>
          <Text style={styles.emptyTitle}>{t('dashboard.empty')}</Text>
          <Text style={styles.emptyDesc}>{t('dashboard.emptyDesc')}</Text>
        </View>
      ) : (
        <FlatList
          data={resumes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isLoading}
          ListHeaderComponent={
            <Text style={styles.sectionLabel}>{t('dashboard.myResumes') || 'My Resumes'} ({resumes.length})</Text>
          }
          renderItem={({ item, index }) => {
            const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
            return (
              <Card onPress={() => handleOpen(item)} variant="elevated" style={styles.resumeCard}>
                <View style={styles.resumeRow}>
                  <View style={[styles.resumeIcon, { backgroundColor: color + '15' }]}>
                    <Text style={[styles.resumeIconText, { color }]}>
                      {item.title.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.resumeInfo}>
                    <Text style={styles.resumeTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.resumeDate}>
                      {t('dashboard.lastEdited')}: {timeAgo(item.updated_at)}
                    </Text>
                  </View>
                  <View style={styles.arrowBox}>
                    <Text style={styles.arrow}>›</Text>
                  </View>
                </View>
              </Card>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background },

  hero: {
    backgroundColor: theme.surface,
    paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    shadowColor: theme.shadowColor, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 15, color: theme.textSecondary, fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: '800', color: theme.text, letterSpacing: -0.3 },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: theme.primaryLight, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: theme.primary,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: theme.primary },

  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: theme.textTertiary,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12,
  },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIconBox: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: theme.primaryLight, justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: theme.text },
  emptyDesc: { fontSize: 14, color: theme.textSecondary, marginTop: 6, textAlign: 'center', lineHeight: 20 },

  list: { padding: 20 },

  resumeCard: { padding: 14 },
  resumeRow: { flexDirection: 'row', alignItems: 'center' },
  resumeIcon: {
    width: 46, height: 46, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  resumeIconText: { fontSize: 20, fontWeight: '800' },
  resumeInfo: { flex: 1, marginLeft: 14 },
  resumeTitle: { fontSize: 16, fontWeight: '700', color: theme.text },
  resumeDate: { fontSize: 12, color: theme.textTertiary, marginTop: 2 },
  arrowBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center',
  },
  arrow: { fontSize: 18, color: theme.textTertiary, fontWeight: '600' },
});
