import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useResumeEditorStore } from '@/stores/resumeEditorStore';
import { theme } from '@/constants/Colors';
import { generateId } from '@/utils/formatDate';

export function EducationForm() {
  const { t } = useTranslation();
  const education = useResumeEditorStore((s) => s.data.education) || [];
  const { addEducation, updateEducation, removeEducation } = useResumeEditorStore();

  const handleAdd = () => {
    addEducation({
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <View>
      {education.map((edu) => (
        <Card key={edu.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{edu.degree || t('editor.degree')}</Text>
            <TouchableOpacity onPress={() => removeEducation(edu.id)}>
              <Text style={styles.remove}>{t('common.delete')}</Text>
            </TouchableOpacity>
          </View>
          <Input label={t('editor.institution')} value={edu.institution} onChangeText={(v) => updateEducation(edu.id, 'institution', v)} placeholder="MIT" />
          <Input label={t('editor.degree')} value={edu.degree} onChangeText={(v) => updateEducation(edu.id, 'degree', v)} placeholder="Bachelor of Science" />
          <Input label={t('editor.field')} value={edu.field || ''} onChangeText={(v) => updateEducation(edu.id, 'field', v)} placeholder="Computer Science" />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input label={t('editor.startDate')} value={edu.startDate} onChangeText={(v) => updateEducation(edu.id, 'startDate', v)} placeholder="2018" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label={t('editor.endDate')} value={edu.endDate || ''} onChangeText={(v) => updateEducation(edu.id, 'endDate', v)} placeholder="2022" />
            </View>
          </View>
        </Card>
      ))}
      <Button title={t('editor.addEducation')} variant="outline" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: theme.text },
  remove: { fontSize: 14, color: theme.error },
  row: { flexDirection: 'row', gap: 12 },
});
