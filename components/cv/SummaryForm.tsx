import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { AIAssistButton } from '@/components/ai/AIAssistButton';
import { useResumeEditorStore } from '@/stores/resumeEditorStore';
import { theme } from '@/constants/Colors';

export function SummaryForm() {
  const { t } = useTranslation();
  const summary = useResumeEditorStore((s) => s.data.personalInfo?.summary) || '';
  const data = useResumeEditorStore((s) => s.data);
  const updatePersonalInfo = useResumeEditorStore((s) => s.updatePersonalInfo);

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
      <AIAssistButton
        section="summary"
        context={{
          jobTitle: data.experience?.[0]?.position,
          skills: data.skills,
        }}
        currentText={summary}
        onApply={(text) => updatePersonalInfo('summary', text)}
      />
      <Text style={styles.hint}>{t('ai.summaryHint')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textArea: { height: 150, textAlignVertical: 'top' },
  hint: { fontSize: 12, color: theme.textTertiary, textAlign: 'center', marginTop: 12 },
});
