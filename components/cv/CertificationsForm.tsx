import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useResumeEditorStore } from '@/stores/resumeEditorStore';
import { theme } from '@/constants/Colors';
import { generateId } from '@/utils/formatDate';

export function CertificationsForm() {
  const { t } = useTranslation();
  const certifications = useResumeEditorStore((s) => s.data.certifications) || [];
  const { addCertification, updateCertification, removeCertification } = useResumeEditorStore();

  const handleAdd = () => {
    addCertification({ id: generateId(), name: '', issuer: '', date: '' });
  };

  return (
    <View>
      {certifications.map((cert) => (
        <Card key={cert.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{cert.name || t('editor.certName')}</Text>
            <TouchableOpacity onPress={() => removeCertification(cert.id)}>
              <Text style={styles.remove}>{t('common.delete')}</Text>
            </TouchableOpacity>
          </View>
          <Input label={t('editor.certName')} value={cert.name} onChangeText={(v) => updateCertification(cert.id, 'name', v)} placeholder="AWS Solutions Architect" />
          <Input label={t('editor.issuer')} value={cert.issuer || ''} onChangeText={(v) => updateCertification(cert.id, 'issuer', v)} placeholder="Amazon Web Services" />
          <Input label={t('editor.date')} value={cert.date || ''} onChangeText={(v) => updateCertification(cert.id, 'date', v)} placeholder="2024" />
        </Card>
      ))}
      <Button title={t('editor.addCertification')} variant="outline" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: theme.text },
  remove: { fontSize: 14, color: theme.error },
});
