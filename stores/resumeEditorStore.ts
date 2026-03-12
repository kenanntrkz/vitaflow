import { create } from 'zustand';
import type { ResumeData, Experience, Education, Language, Certification } from '@/types/resume';

interface ResumeEditorState {
  resumeId: number | null;
  title: string;
  templateId: number | null;
  data: ResumeData;
  currentStep: number;
  isDirty: boolean;

  // Actions
  init: (id: number | null, title: string, templateId: number | null, data: ResumeData) => void;
  reset: () => void;
  setStep: (step: number) => void;
  setTitle: (title: string) => void;
  setTemplateId: (id: number) => void;

  // Personal Info
  updatePersonalInfo: (field: string, value: string) => void;

  // Experience
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, field: string, value: any) => void;
  removeExperience: (id: string) => void;

  // Education
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, field: string, value: any) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;

  // Languages
  addLanguage: (lang: Language) => void;
  updateLanguage: (id: string, field: string, value: string) => void;
  removeLanguage: (id: string) => void;

  // Certifications
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, field: string, value: string) => void;
  removeCertification: (id: string) => void;
}

const INITIAL_DATA: ResumeData = {
  personalInfo: {},
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
};

export const EDITOR_STEPS = [
  { key: 'personal', title: 'Personal Info', titleTr: 'Kisisel Bilgiler' },
  { key: 'experience', title: 'Experience', titleTr: 'Deneyim' },
  { key: 'education', title: 'Education', titleTr: 'Egitim' },
  { key: 'skills', title: 'Skills', titleTr: 'Yetenekler' },
  { key: 'languages', title: 'Languages', titleTr: 'Diller' },
  { key: 'certifications', title: 'Certifications', titleTr: 'Sertifikalar' },
  { key: 'summary', title: 'Summary', titleTr: 'Ozet' },
] as const;

export const useResumeEditorStore = create<ResumeEditorState>((set) => ({
  resumeId: null,
  title: 'Untitled Resume',
  templateId: null,
  data: { ...INITIAL_DATA },
  currentStep: 0,
  isDirty: false,

  init: (id, title, templateId, data) => {
    set({
      resumeId: id,
      title,
      templateId,
      data: { ...INITIAL_DATA, ...data },
      currentStep: 0,
      isDirty: false,
    });
  },

  reset: () => {
    set({
      resumeId: null,
      title: 'Untitled Resume',
      templateId: null,
      data: { ...INITIAL_DATA },
      currentStep: 0,
      isDirty: false,
    });
  },

  setStep: (step) => set({ currentStep: step }),
  setTitle: (title) => set({ title, isDirty: true }),
  setTemplateId: (id) => set({ templateId: id, isDirty: true }),

  updatePersonalInfo: (field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        personalInfo: { ...state.data.personalInfo, [field]: value },
      },
      isDirty: true,
    }));
  },

  addExperience: (exp) => {
    set((state) => ({
      data: { ...state.data, experience: [...(state.data.experience || []), exp] },
      isDirty: true,
    }));
  },

  updateExperience: (id, field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        experience: (state.data.experience || []).map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        ),
      },
      isDirty: true,
    }));
  },

  removeExperience: (id) => {
    set((state) => ({
      data: {
        ...state.data,
        experience: (state.data.experience || []).filter((e) => e.id !== id),
      },
      isDirty: true,
    }));
  },

  addEducation: (edu) => {
    set((state) => ({
      data: { ...state.data, education: [...(state.data.education || []), edu] },
      isDirty: true,
    }));
  },

  updateEducation: (id, field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        education: (state.data.education || []).map((e) =>
          e.id === id ? { ...e, [field]: value } : e
        ),
      },
      isDirty: true,
    }));
  },

  removeEducation: (id) => {
    set((state) => ({
      data: {
        ...state.data,
        education: (state.data.education || []).filter((e) => e.id !== id),
      },
      isDirty: true,
    }));
  },

  addSkill: (skill) => {
    set((state) => ({
      data: {
        ...state.data,
        skills: [...(state.data.skills || []), skill],
      },
      isDirty: true,
    }));
  },

  removeSkill: (skill) => {
    set((state) => ({
      data: {
        ...state.data,
        skills: (state.data.skills || []).filter((s) => s !== skill),
      },
      isDirty: true,
    }));
  },

  addLanguage: (lang) => {
    set((state) => ({
      data: { ...state.data, languages: [...(state.data.languages || []), lang] },
      isDirty: true,
    }));
  },

  updateLanguage: (id, field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        languages: (state.data.languages || []).map((l) =>
          l.id === id ? { ...l, [field]: value } : l
        ),
      },
      isDirty: true,
    }));
  },

  removeLanguage: (id) => {
    set((state) => ({
      data: {
        ...state.data,
        languages: (state.data.languages || []).filter((l) => l.id !== id),
      },
      isDirty: true,
    }));
  },

  addCertification: (cert) => {
    set((state) => ({
      data: { ...state.data, certifications: [...(state.data.certifications || []), cert] },
      isDirty: true,
    }));
  },

  updateCertification: (id, field, value) => {
    set((state) => ({
      data: {
        ...state.data,
        certifications: (state.data.certifications || []).map((c) =>
          c.id === id ? { ...c, [field]: value } : c
        ),
      },
      isDirty: true,
    }));
  },

  removeCertification: (id) => {
    set((state) => ({
      data: {
        ...state.data,
        certifications: (state.data.certifications || []).filter((c) => c.id !== id),
      },
      isDirty: true,
    }));
  },
}));
