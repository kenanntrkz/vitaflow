import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getResumes } from '@/services/resumes';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/Colors';
import { timeAgo } from '@/utils/formatDate';
import type { Resume } from '@/types/resume';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { data: resumes, isLoading, refetch } = useQuery({
    queryKey: ['resumes'],
    queryFn: getResumes,
  });

  const handleCreate = () => {
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
      {!resumes?.length ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyTitle}>{t('dashboard.empty')}</Text>
          <Text style={styles.emptyDesc}>{t('dashboard.emptyDesc')}</Text>
          <Button title={t('dashboard.createNew')} onPress={handleCreate} style={{ marginTop: 24 }} />
        </View>
      ) : (
        <FlatList
          data={resumes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isLoading}
          ListHeaderComponent={
            <Button title={t('dashboard.createNew')} onPress={handleCreate} style={{ marginBottom: 16 }} />
          }
          renderItem={({ item }) => (
            <Card onPress={() => handleOpen(item)} style={styles.resumeCard}>
              <View style={styles.resumeRow}>
                <View style={styles.resumeIcon}>
                  <Text style={styles.resumeIconText}>
                    {item.title.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.resumeInfo}>
                  <Text style={styles.resumeTitle}>{item.title}</Text>
                  <Text style={styles.resumeDate}>
                    {t('dashboard.lastEdited')}: {timeAgo(item.updated_at)}
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </View>
            </Card>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: theme.text },
  emptyDesc: { fontSize: 14, color: theme.textSecondary, marginTop: 8, textAlign: 'center' },
  list: { padding: 16 },
  resumeCard: { padding: 16 },
  resumeRow: { flexDirection: 'row', alignItems: 'center' },
  resumeIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: theme.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  resumeIconText: { fontSize: 18, fontWeight: '700', color: theme.primary },
  resumeInfo: { flex: 1, marginLeft: 12 },
  resumeTitle: { fontSize: 16, fontWeight: '600', color: theme.text },
  resumeDate: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
  arrow: { fontSize: 24, color: theme.textTertiary },
});
