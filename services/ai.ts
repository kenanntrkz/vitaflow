import { api } from './api';

interface GenerateParams {
  section: 'summary' | 'experience' | 'skills';
  context: {
    jobTitle?: string;
    company?: string;
    industry?: string;
    yearsOfExperience?: number;
    existingText?: string;
    skills?: string[];
  };
  locale?: string;
}

interface ATSCheckParams {
  resumeData: Record<string, any>;
  jobDescription?: string;
  locale?: string;
}

interface ATSResult {
  score: number;
  suggestions: string[];
  breakdown?: Record<string, { score: number; issues: string[] }>;
  isPremiumResult: boolean;
}

export async function generateContent(params: GenerateParams): Promise<{ text: string }> {
  return api('/ai/generate', {
    method: 'POST',
    body: JSON.stringify({ ...params, locale: params.locale || 'en' }),
  });
}

export async function optimizeContent(text: string, section: string, locale: string = 'en'): Promise<{ text: string }> {
  return api('/ai/optimize', {
    method: 'POST',
    body: JSON.stringify({ text, section, locale }),
  });
}

export async function checkATS(params: ATSCheckParams): Promise<ATSResult> {
  return api('/ai/ats-check', {
    method: 'POST',
    body: JSON.stringify({ ...params, locale: params.locale || 'en' }),
  });
}
