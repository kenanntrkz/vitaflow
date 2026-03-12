import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useResumeEditorStore } from '@/stores/resumeEditorStore';
import { theme } from '@/constants/Colors';

export function SkillsForm() {
  const { t } = useTranslation();
  const skills = useResumeEditorStore((s) => s.data.skills) || [];
  const { addSkill, removeSkill } = useResumeEditorStore();
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      addSkill(trimmed);
      setNewSkill('');
    }
  };

  return (
    <View>
      <View style={styles.inputRow}>
        <View style={{ flex: 1 }}>
          <Input
            placeholder={t('editor.skillName')}
            value={newSkill}
            onChangeText={setNewSkill}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
        </View>
        <Button title="+" onPress={handleAdd} size="sm" style={{ marginBottom: 16, width: 48 }} />
      </View>
      <View style={styles.tags}>
        {skills.map((skill) => (
          <TouchableOpacity key={skill} style={styles.tag} onPress={() => removeSkill(skill)} activeOpacity={0.7}>
            <Text style={styles.tagText}>{skill}</Text>
            <Text style={styles.tagRemove}>×</Text>
          </TouchableOpacity>
        ))}
      </View>
      {skills.length === 0 && (
        <Text style={styles.hint}>Add skills like "React", "Python", "Project Management"</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.primaryLight, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, gap: 6,
  },
  tagText: { fontSize: 14, color: theme.primary, fontWeight: '500' },
  tagRemove: { fontSize: 18, color: theme.primary },
  hint: { color: theme.textTertiary, fontSize: 13, marginTop: 12, textAlign: 'center' },
});
