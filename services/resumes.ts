import { api } from './api';
import type { Resume, ResumeData } from '@/types/resume';

export async function getResumes(): Promise<Resume[]> {
  const data = await api<{ resumes: Resume[] }>('/resumes');
  return data.resumes;
}

export async function getResume(id: number): Promise<Resume> {
  const data = await api<{ resume: Resume }>(`/resumes/${id}`);
  return data.resume;
}

export async function createResume(title: string, templateId?: number, dataJson?: ResumeData, locale?: string): Promise<Resume> {
  const data = await api<{ resume: Resume }>('/resumes', {
    method: 'POST',
    body: JSON.stringify({
      title,
      template_id: templateId,
      data_json: dataJson || {},
      locale: locale || 'en',
    }),
  });
  return data.resume;
}

export async function updateResume(id: number, updates: {
  title?: string;
  template_id?: number | null;
  data_json?: ResumeData;
  locale?: string;
}): Promise<Resume> {
  const data = await api<{ resume: Resume }>(`/resumes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data.resume;
}

export async function deleteResume(id: number): Promise<void> {
  await api(`/resumes/${id}`, { method: 'DELETE' });
}
