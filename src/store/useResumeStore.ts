import { create } from 'zustand';
import type { Resume, WorkExperience, AttachmentItem } from '@/types';
import { mockResume } from '@/data/profile';

interface ResumeState {
  resume: Resume;
  setBasicInfo: (info: Partial<{ name: string; phone: string; email: string; age: number; gender: string }>) => void;
  addWorkExperience: (exp: Omit<WorkExperience, 'id'>) => void;
  updateWorkExperience: (id: string, exp: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  setSkills: (skills: string[]) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  setExpectation: (expectation: Partial<{ expectedSalary: string; expectedPosition: string; expectedLocation: string }>) => void;
  addAttachment: (attachment: Omit<AttachmentItem, 'id'>) => void;
  removeAttachment: (id: string) => void;
  calculateCompletion: () => number;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resume: { ...mockResume, workExperiences: [...mockResume.workExperiences], skills: [...mockResume.skills], attachments: [...mockResume.attachments] },

  setBasicInfo: (info) => {
    set((state) => ({
      resume: { ...state.resume, ...info },
    }));
    get().calculateCompletion();
  },

  addWorkExperience: (exp) => {
    const newExp: WorkExperience = {
      ...exp,
      id: Date.now().toString(),
    };
    set((state) => ({
      resume: {
        ...state.resume,
        workExperiences: [newExp, ...state.resume.workExperiences],
      },
    }));
    get().calculateCompletion();
  },

  updateWorkExperience: (id, exp) => {
    set((state) => ({
      resume: {
        ...state.resume,
        workExperiences: state.resume.workExperiences.map((e) =>
          e.id === id ? { ...e, ...exp } : e
        ),
      },
    }));
    get().calculateCompletion();
  },

  removeWorkExperience: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        workExperiences: state.resume.workExperiences.filter((e) => e.id !== id),
      },
    }));
    get().calculateCompletion();
  },

  setSkills: (skills) => {
    set((state) => ({
      resume: { ...state.resume, skills },
    }));
    get().calculateCompletion();
  },

  addSkill: (skill) => {
    set((state) => ({
      resume: {
        ...state.resume,
        skills: state.resume.skills.includes(skill)
          ? state.resume.skills
          : [...state.resume.skills, skill],
      },
    }));
    get().calculateCompletion();
  },

  removeSkill: (skill) => {
    set((state) => ({
      resume: {
        ...state.resume,
        skills: state.resume.skills.filter((s) => s !== skill),
      },
    }));
    get().calculateCompletion();
  },

  setExpectation: (expectation) => {
    set((state) => ({
      resume: { ...state.resume, ...expectation },
    }));
    get().calculateCompletion();
  },

  addAttachment: (attachment) => {
    const newAtt: AttachmentItem = {
      ...attachment,
      id: Date.now().toString(),
    };
    set((state) => ({
      resume: {
        ...state.resume,
        attachments: [newAtt, ...state.resume.attachments],
      },
    }));
    get().calculateCompletion();
  },

  removeAttachment: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        attachments: state.resume.attachments.filter((a) => a.id !== id),
      },
    }));
    get().calculateCompletion();
  },

  calculateCompletion: () => {
    let score = 0;
    const r = get().resume;

    if (r.name) score += 10;
    if (r.phone) score += 10;
    if (r.email) score += 5;
    if (r.age) score += 5;
    if (r.gender) score += 5;
    if (r.workExperiences.length > 0) score += 20;
    if (r.workExperiences.length >= 2) score += 10;
    if (r.skills.length > 0) score += 10;
    if (r.skills.length >= 5) score += 5;
    if (r.expectedSalary) score += 5;
    if (r.expectedPosition) score += 5;
    if (r.expectedLocation) score += 5;
    if (r.attachments.length > 0) score += 5;

    set((state) => ({
      resume: { ...state.resume, completion: Math.min(score, 100) },
    }));

    return Math.min(score, 100);
  },
}));
