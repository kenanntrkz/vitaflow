import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getResume } from '@/services/resumes';
import { checkATS } from '@/services/ai';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { theme } from '@/constants/Colors';

export default function ATSScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const resumeId = parseInt(id);

  const { data: resume } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => getResume(resumeId),
  });

  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ score: number; suggestions: string[] } | null>(null);

  const handleCheck = async () => {
    if (!resume) return;
    setChecking(true);
    try {
      const atsResult = await checkATS({ resumeData: resume.data_json });
      setResult(atsResult);
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message);
    } finally {
      setChecking(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.success;
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return theme.error;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return t('ats.excellent');
    if (score >= 60) return t('ats.good');
    if (score >= 40) return t('ats.needsWork');
    return t('ats.poor');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="‹ Back" variant="ghost" onPress={() => router.back()} size="sm" />
        <Text style={styles.title}>{t('ats.title')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!result ? (
          <View style={styles.center}>
            <View style={styles.scoreCircle}>
              <Text style={styles.questionMark}>?</Text>
            </View>
            <Text style={styles.checkTitle}>{t('ats.title')}</Text>
            <Text style={styles.checkDesc}>
              Check how well your resume performs against ATS systems
            </Text>
            <Button
              title={checking ? t('ats.checking') : t('ats.check')}
              onPress={handleCheck}
              loading={checking}
              style={{ marginTop: 24, width: '100%' }}
            />
          </View>
        ) : (
          <>
            <View style={styles.scoreSection}>
              <View style={[styles.scoreCircleResult, { borderColor: getScoreColor(result.score) }]}>
                <Text style={[styles.scoreNumber, { color: getScoreColor(result.score) }]}>
                  {result.score}
                </Text>
                <Text style={styles.scoreOf}>/100</Text>
              </View>
              <Text style={[styles.scoreLabel, { color: getScoreColor(result.score) }]}>
                {getScoreLabel(result.score)}
              </Text>
            </View>

            <Card style={styles.suggestionsCard}>
              <Text style={styles.suggestionsTitle}>{t('ats.suggestions')}</Text>
              {result.suggestions.map((suggestion, i) => (
                <View key={i} style={styles.suggestionRow}>
                  <Text style={styles.suggestionBullet}>•</Text>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </Card>

            <Button
              title="Re-check"
              variant="outline"
              onPress={handleCheck}
              loading={checking}
              style={{ marginTop: 16 }}
            />
          </>
        )}
      </ScrollView>
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
  content: { padding: 24 },
  center: { alignItems: 'center', paddingTop: 60 },
  scoreCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: theme.border, justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  questionMark: { fontSize: 48, color: theme.textTertiary, fontWeight: '300' },
  checkTitle: { fontSize: 24, fontWeight: '700', color: theme.text },
  checkDesc: { fontSize: 14, color: theme.textSecondary, textAlign: 'center', marginTop: 8 },
  scoreSection: { alignItems: 'center', marginBottom: 32 },
  scoreCircleResult: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 6, justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  scoreNumber: { fontSize: 48, fontWeight: '800' },
  scoreOf: { fontSize: 16, color: theme.textSecondary },
  scoreLabel: { fontSize: 20, fontWeight: '700' },
  suggestionsCard: { padding: 20 },
  suggestionsTitle: { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 16 },
  suggestionRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  suggestionBullet: { fontSize: 16, color: theme.primary, fontWeight: '700' },
  suggestionText: { flex: 1, fontSize: 14, color: theme.text, lineHeight: 20 },
});
