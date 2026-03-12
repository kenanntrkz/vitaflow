import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { createResume } from '@/services/resumes';
import { useResumeEditorStore } from '@/stores/resumeEditorStore';
import { theme } from '@/constants/Colors';

export default function NewResumeScreen() {
  const { t, i18n } = useTranslation();
  const { templateId } = useLocalSearchParams<{ templateId?: string }>();
  const init = useResumeEditorStore((s) => s.init);
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resume = await createResume(
          'Untitled Resume',
          templateId ? parseInt(templateId) : undefined,
          {},
          i18n.language
        );
        init(resume.id, resume.title, resume.template_id, resume.data_json);
        queryClient.invalidateQueries({ queryKey: ['resumes'] });
        router.replace(`/cv/${resume.id}/edit`);
      } catch (err: any) {
        Alert.alert(t('common.error'), err.message);
        router.back();
      } finally {
        setCreating(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={styles.text}>{t('common.loading')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background },
  text: { marginTop: 16, color: theme.textSecondary, fontSize: 16 },
});
