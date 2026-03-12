import { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getResume, updateResume } from '@/services/resumes';
import { useResumeEditorStore, EDITOR_STEPS } from '@/stores/resumeEditorStore';
import { Button } from '@/components/ui/Button';
import { PersonalInfoForm } from '@/components/cv/PersonalInfoForm';
import { ExperienceForm } from '@/components/cv/ExperienceForm';
import { EducationForm } from '@/components/cv/EducationForm';
import { SkillsForm } from '@/components/cv/SkillsForm';
import { LanguagesForm } from '@/components/cv/LanguagesForm';
import { CertificationsForm } from '@/components/cv/CertificationsForm';
import { SummaryForm } from '@/components/cv/SummaryForm';
import { theme } from '@/constants/Colors';

export default function EditResumeScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const resumeId = parseInt(id);
  const queryClient = useQueryClient();

  const { init, data, currentStep, setStep, isDirty, title, templateId } = useResumeEditorStore();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: resume } = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => getResume(resumeId),
    enabled: !!resumeId,
  });

  useEffect(() => {
    if (resume) {
      init(resume.id, resume.title, resume.template_id, resume.data_json);
    }
  }, [resume?.id]);

  // Debounced auto-save (5 seconds)
  const autoSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      if (!isDirty) return;
      try {
        await updateResume(resumeId, { title, template_id: templateId, data_json: data });
        queryClient.invalidateQueries({ queryKey: ['resumes'] });
      } catch {}
    }, 5000);
  }, [isDirty, data, title, templateId]);

  useEffect(() => {
    if (isDirty) autoSave();
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [isDirty, data]);

  const handleSave = async () => {
    try {
      await updateResume(resumeId, { title, template_id: templateId, data_json: data });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      Alert.alert(t('common.success'), t('editor.save'));
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message);
    }
  };

  const handleNext = () => {
    if (currentStep < EDITOR_STEPS.length - 1) setStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setStep(currentStep - 1);
    else router.back();
  };

  const stepComponents = [
    <PersonalInfoForm key="personal" />,
    <ExperienceForm key="experience" />,
    <EducationForm key="education" />,
    <SkillsForm key="skills" />,
    <LanguagesForm key="languages" />,
    <CertificationsForm key="certifications" />,
    <SummaryForm key="summary" />,
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backBtn}>‹ {currentStep === 0 ? 'Back' : t('editor.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.stepTitle}>
          {t(`editor.${EDITOR_STEPS[currentStep].key}` as any)}
        </Text>
        <TouchableOpacity onPress={() => router.push(`/cv/${resumeId}/preview`)}>
          <Text style={styles.previewBtn}>{t('editor.preview')}</Text>
        </TouchableOpacity>
      </View>

      {/* Step indicator */}
      <View style={styles.steps}>
        {EDITOR_STEPS.map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.stepDot, i === currentStep && styles.stepDotActive, i < currentStep && styles.stepDotDone]}
            onPress={() => setStep(i)}
          />
        ))}
      </View>

      {/* Form */}
      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        {stepComponents[currentStep]}
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        {currentStep < EDITOR_STEPS.length - 1 ? (
          <Button title={t('editor.next')} onPress={handleNext} style={{ flex: 1 }} />
        ) : (
          <View style={{ flex: 1, flexDirection: 'row', gap: 12 }}>
            <Button title={t('editor.save')} onPress={handleSave} style={{ flex: 1 }} />
            <Button
              title={t('editor.preview')}
              variant="outline"
              onPress={() => router.push(`/cv/${resumeId}/preview`)}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12,
    backgroundColor: theme.surface, borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  backBtn: { fontSize: 16, color: theme.primary, fontWeight: '500' },
  stepTitle: { fontSize: 18, fontWeight: '700', color: theme.text },
  previewBtn: { fontSize: 14, color: theme.secondary, fontWeight: '600' },
  steps: {
    flexDirection: 'row', justifyContent: 'center', gap: 8,
    paddingVertical: 12, backgroundColor: theme.surface,
  },
  stepDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: theme.border,
  },
  stepDotActive: { backgroundColor: theme.primary, width: 24 },
  stepDotDone: { backgroundColor: theme.primary },
  form: { flex: 1, padding: 16 },
  bottomBar: {
    flexDirection: 'row', padding: 16, gap: 12,
    backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border,
  },
});
