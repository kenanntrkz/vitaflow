export interface PersonalInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
}

export interface ResumeData {
  personalInfo?: PersonalInfo;
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  languages?: Language[];
  certifications?: Certification[];
}

export interface Resume {
  id: number;
  user_id: number;
  title: string;
  template_id: number | null;
  data_json: ResumeData;
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: number;
  name: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  html_css: string;
  is_premium: boolean;
  sort_order: number;
}
