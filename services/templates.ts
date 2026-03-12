import { api } from './api';
import type { Template } from '@/types/resume';

export async function getTemplates(): Promise<Template[]> {
  const data = await api<{ templates: Template[] }>('/templates');
  return data.templates;
}

export async function getTemplate(id: number): Promise<Template> {
  const data = await api<{ template: Template }>(`/templates/${id}`);
  return data.template;
}
