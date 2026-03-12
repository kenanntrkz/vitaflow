import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useResumeEditorStore } from '@/stores/resumeEditorStore';
import { generateContent } from '@/services/ai';
import { theme } from '@/constants/Colors';

export function SummaryForm() {
  const { t, i18n } = useTranslation();
  const summary = useResumeEditorStore((s) => s.data.personalInfo?.summary) || '';
  const data = useResumeEditorStore((s) => s.data);
  const updatePersonalInfo = useResumeEditorStore((s) => s.updatePersonalInfo);
  const [generating, setGenerating] = useState(false);

  const handleAIGenerate = async () => {
    setGenerating(true);
    try {
      const jobTitle = data.experience?.[0]?.position;
      const skills = data.skills;
      const { text } = await generateContent({
        section: 'summary',
        context: { jobTitle, skills },
        locale: i18n.language,
      });
      updatePersonalInfo('summary', text);
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View>
      <Input
        label={t('editor.summary')}
        value={summary}
        onChangeText={(v) => updatePersonalInfo('summary', v)}
        multiline
        numberOfLines={6}
        style={styles.textArea}
        placeholder={t('editor.summaryPlaceholder')}
      />
      <Button
        title={generating ? t('ai.generating') : t('ai.generate')}
        variant="secondary"
        onPress={handleAIGenerate}
        loading={generating}
        disabled={generating}
      />
      <Text style={styles.hint}>
        AI will generate a professional summary based on your experience and skills
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textArea: { height: 150, textAlignVertical: 'top' },
  hint: { fontSize: 12, color: theme.textTertiary, textAlign: 'center', marginTop: 12 },
});
