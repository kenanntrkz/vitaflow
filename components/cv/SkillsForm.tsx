import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useResumeEditorStore } from '@/stores/resumeEditorStore';
import { generateContent } from '@/services/ai';
import { theme } from '@/constants/Colors';

export function SkillsForm() {
  const { t, i18n } = useTranslation();
  const skills = useResumeEditorStore((s) => s.data.skills) || [];
  const { addSkill, removeSkill } = useResumeEditorStore();
  const [newSkill, setNewSkill] = useState('');
  const [suggesting, setSuggesting] = useState(false);
  const data = useResumeEditorStore((s) => s.data);

  const handleAdd = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      addSkill(trimmed);
      setNewSkill('');
    }
  };

  const handleAISuggest = async () => {
    setSuggesting(true);
    try {
      const jobTitle = data.experience?.[0]?.position;
      const { text } = await generateContent({
        section: 'skills',
        context: { jobTitle, skills },
        locale: i18n.language,
      });
      const suggested = text.split(',').map((s: string) => s.trim()).filter((s: string) => s && !skills.includes(s));
      suggested.forEach((s: string) => addSkill(s));
    } catch (err: any) {
      if (err.message?.includes('limit')) {
        Alert.alert(t('ai.limitReached'), t('ai.upgradeForMore'));
      } else {
        Alert.alert(t('common.error'), err.message);
      }
    } finally {
      setSuggesting(false);
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
      <Button
        title={suggesting ? t('ai.generating') : t('ai.suggestSkills')}
        variant="secondary"
        onPress={handleAISuggest}
        loading={suggesting}
        disabled={suggesting}
        size="sm"
        style={{ marginTop: 16 }}
      />
      {skills.length === 0 && (
        <Text style={styles.hint}>{t('editor.skillsHint')}</Text>
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
