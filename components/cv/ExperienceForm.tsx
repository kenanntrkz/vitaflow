import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useResumeEditorStore } from '@/stores/resumeEditorStore';
import { theme } from '@/constants/Colors';
import { generateId } from '@/utils/formatDate';

export function ExperienceForm() {
  const { t } = useTranslation();
  const experience = useResumeEditorStore((s) => s.data.experience) || [];
  const { addExperience, updateExperience, removeExperience } = useResumeEditorStore();

  const handleAdd = () => {
    addExperience({
      id: generateId(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
  };

  return (
    <View>
      {experience.map((exp) => (
        <Card key={exp.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{exp.position || t('editor.position')}</Text>
            <TouchableOpacity onPress={() => removeExperience(exp.id)}>
              <Text style={styles.remove}>{t('common.delete')}</Text>
            </TouchableOpacity>
          </View>
          <Input label={t('editor.company')} value={exp.company} onChangeText={(v) => updateExperience(exp.id, 'company', v)} placeholder="Acme Corp" />
          <Input label={t('editor.position')} value={exp.position} onChangeText={(v) => updateExperience(exp.id, 'position', v)} placeholder="Software Engineer" />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input label={t('editor.startDate')} value={exp.startDate} onChangeText={(v) => updateExperience(exp.id, 'startDate', v)} placeholder="2022-01" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label={t('editor.endDate')} value={exp.endDate || ''} onChangeText={(v) => updateExperience(exp.id, 'endDate', v)} placeholder="2024-12" editable={!exp.current} />
            </View>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('editor.current')}</Text>
            <Switch
              value={exp.current}
              onValueChange={(v) => updateExperience(exp.id, 'current', v)}
              trackColor={{ true: theme.primary }}
            />
          </View>
          <Input
            label={t('editor.description')}
            value={exp.description}
            onChangeText={(v) => updateExperience(exp.id, 'description', v)}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' }}
            placeholder="Led development of..."
          />
        </Card>
      ))}
      <Button title={t('editor.addExperience')} variant="outline" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: theme.text },
  remove: { fontSize: 14, color: theme.error },
  row: { flexDirection: 'row', gap: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  switchLabel: { fontSize: 14, color: theme.text },
});
