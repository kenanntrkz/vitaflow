import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useQuery } from '@tanstack/react-query';
import { getResume } from '@/services/resumes';
import { getTemplate } from '@/services/templates';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { generateResumeHTML } from '@/utils/generateHTML';
import { theme } from '@/constants/Colors';

export default function PreviewScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const resumeId = parseInt(id);
  const isPremium = useAuthStore((s) => s.user?.is_premium);
  const [html, setHtml] = useState('');
  const [exporting, setExporting] = useState(false);

  const { data: resume } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => getResume(resumeId),
  });

  const { data: template } = useQuery({
    queryKey: ['template', resume?.template_id],
    queryFn: () => getTemplate(resume!.template_id!),
    enabled: !!resume?.template_id,
  });

  useEffect(() => {
    if (resume && template) {
      const generated = generateResumeHTML(resume.data_json, template.html_css, !isPremium);
      setHtml(generated);
    }
  }, [resume, template, isPremium]);

  const handleExportPDF = async () => {
    if (!html) return;
    setExporting(true);
    try {
      const { uri } = await Print.printToFileAsync({
        html,
        width: 595,
        height: 842,
      });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="‹ Back" variant="ghost" onPress={() => router.back()} size="sm" />
        <Text style={styles.title}>{t('preview.title')}</Text>
        <Button
          title={t('ats.check')}
          variant="ghost"
          onPress={() => router.push(`/cv/${resumeId}/ats`)}
          size="sm"
        />
      </View>

      <View style={styles.previewContainer}>
        {html ? (
          <WebView
            source={{ html }}
            style={styles.webview}
            scalesPageToFit
            scrollEnabled
          />
        ) : (
          <Text style={styles.loading}>{t('common.loading')}</Text>
        )}
      </View>

      <View style={styles.bottomBar}>
        {!isPremium && (
          <Button
            title="PRO"
            variant="secondary"
            onPress={() => router.push('/paywall')}
            size="sm"
            style={{ width: 60 }}
          />
        )}
        <Button
          title={t('preview.exportPDF')}
          onPress={handleExportPDF}
          loading={exporting}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 8, paddingTop: 56, paddingBottom: 8,
    backgroundColor: theme.surface, borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  title: { fontSize: 18, fontWeight: '700', color: theme.text },
  previewContainer: {
    flex: 1, margin: 16, borderRadius: 12, overflow: 'hidden',
    backgroundColor: '#fff', elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12,
  },
  webview: { flex: 1, backgroundColor: '#fff' },
  loading: { flex: 1, textAlign: 'center', marginTop: 100, color: theme.textSecondary },
  bottomBar: {
    flexDirection: 'row', padding: 16, gap: 12,
    backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border,
  },
});
