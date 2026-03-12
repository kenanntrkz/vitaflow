import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useResumeEditorStore } from '@/stores/resumeEditorStore';
import { theme } from '@/constants/Colors';
import { generateId } from '@/utils/formatDate';

const LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];

export function LanguagesForm() {
  const { t } = useTranslation();
  const languages = useResumeEditorStore((s) => s.data.languages) || [];
  const { addLanguage, updateLanguage, removeLanguage } = useResumeEditorStore();

  const handleAdd = () => {
    addLanguage({ id: generateId(), name: '', level: 'Intermediate' });
  };

  return (
    <View>
      {languages.map((lang) => (
        <Card key={lang.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{lang.name || t('editor.languageName')}</Text>
            <TouchableOpacity onPress={() => removeLanguage(lang.id)}>
              <Text style={styles.remove}>{t('common.delete')}</Text>
            </TouchableOpacity>
          </View>
          <Input label={t('editor.languageName')} value={lang.name} onChangeText={(v) => updateLanguage(lang.id, 'name', v)} placeholder="English" />
          <Text style={styles.levelLabel}>{t('editor.level')}</Text>
          <View style={styles.levels}>
            {LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.levelBtn, lang.level === level && styles.levelBtnActive]}
                onPress={() => updateLanguage(lang.id, 'level', level)}
              >
                <Text style={[styles.levelText, lang.level === level && styles.levelTextActive]}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      ))}
      <Button title={t('editor.addLanguage')} variant="outline" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: theme.text },
  remove: { fontSize: 14, color: theme.error },
  levelLabel: { fontSize: 14, fontWeight: '500', color: theme.text, marginBottom: 8 },
  levels: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  levelBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: theme.border,
  },
  levelBtnActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  levelText: { fontSize: 13, color: theme.textSecondary },
  levelTextActive: { color: '#fff', fontWeight: '600' },
});
