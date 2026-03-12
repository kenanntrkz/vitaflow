import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { generateContent, optimizeContent } from '@/services/ai';
import { theme } from '@/constants/Colors';

interface AIAssistButtonProps {
  section: 'summary' | 'experience' | 'skills';
  context: Record<string, any>;
  currentText?: string;
  onApply: (text: string) => void;
  mode?: 'generate' | 'optimize' | 'both';
}

export function AIAssistButton({ section, context, currentText, onApply, mode = 'both' }: AIAssistButtonProps) {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { text } = await generateContent({
        section,
        context,
        locale: i18n.language,
      });
      setResult(text);
      setModalVisible(true);
    } catch (err: any) {
      if (err.message?.includes('limit')) {
        Alert.alert(t('ai.limitReached'), t('ai.upgradeForMore'));
      } else {
        Alert.alert(t('common.error'), err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!currentText?.trim()) return;
    setLoading(true);
    try {
      const { text } = await optimizeContent(currentText, section, i18n.language);
      setResult(text);
      setModalVisible(true);
    } catch (err: any) {
      if (err.message?.includes('limit')) {
        Alert.alert(t('ai.limitReached'), t('ai.upgradeForMore'));
      } else {
        Alert.alert(t('common.error'), err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      setModalVisible(false);
      setResult(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        {(mode === 'generate' || mode === 'both') && (
          <Button
            title={loading ? t('ai.generating') : t('ai.generate')}
            variant="secondary"
            onPress={handleGenerate}
            loading={loading}
            disabled={loading}
            size="sm"
            style={styles.btn}
          />
        )}
        {(mode === 'optimize' || mode === 'both') && currentText?.trim() && (
          <Button
            title={loading ? t('ai.optimizing') : t('ai.optimize')}
            variant="outline"
            onPress={handleOptimize}
            loading={loading}
            disabled={loading}
            size="sm"
            style={styles.btn}
          />
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('ai.suggestion')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.close}>×</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.resultText}>{result}</Text>
            </ScrollView>
            <View style={styles.modalFooter}>
              <Button
                title={t('common.cancel')}
                variant="ghost"
                onPress={() => setModalVisible(false)}
                size="sm"
                style={{ flex: 1 }}
              />
              <Button
                title={t('ai.apply')}
                onPress={handleApply}
                size="sm"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8, marginBottom: 4 },
  buttons: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1 },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: theme.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '70%', paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: theme.text },
  close: { fontSize: 28, color: theme.textSecondary, lineHeight: 28 },
  modalBody: { padding: 20, maxHeight: 300 },
  resultText: { fontSize: 15, color: theme.text, lineHeight: 24 },
  modalFooter: {
    flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: theme.border,
  },
});
