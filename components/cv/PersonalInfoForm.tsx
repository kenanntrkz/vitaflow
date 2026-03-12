import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { useResumeEditorStore } from '@/stores/resumeEditorStore';

export function PersonalInfoForm() {
  const { t } = useTranslation();
  const pi = useResumeEditorStore((s) => s.data.personalInfo) || {};
  const update = useResumeEditorStore((s) => s.updatePersonalInfo);

  return (
    <>
      <Input label={t('editor.fullName')} value={pi.fullName || ''} onChangeText={(v) => update('fullName', v)} placeholder="John Doe" />
      <Input label={t('auth.email')} value={pi.email || ''} onChangeText={(v) => update('email', v)} keyboardType="email-address" autoCapitalize="none" placeholder="john@example.com" />
      <Input label={t('editor.phone')} value={pi.phone || ''} onChangeText={(v) => update('phone', v)} keyboardType="phone-pad" placeholder="+1 (555) 123-4567" />
      <Input label={t('editor.location')} value={pi.location || ''} onChangeText={(v) => update('location', v)} placeholder="New York, NY" />
      <Input label={t('editor.linkedin')} value={pi.linkedin || ''} onChangeText={(v) => update('linkedin', v)} autoCapitalize="none" placeholder="linkedin.com/in/johndoe" />
      <Input label={t('editor.website')} value={pi.website || ''} onChangeText={(v) => update('website', v)} autoCapitalize="none" placeholder="johndoe.com" />
    </>
  );
}
