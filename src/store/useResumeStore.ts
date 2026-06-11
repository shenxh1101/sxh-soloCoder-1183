import { create } from 'zustand';
import type { Resume, WorkExperience, AttachmentItem } from '@/types';
import { mockResume } from '@/data/profile';

const calcCompletion = (r: Resume): number => {
  let score = 0;
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
  return Math.min(score, 100);
};

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
  resume: { ...mockResume, workExperiences: [...mockResume.workExperiences], skills: [...mockResume.skills], attachments: [...mockResume.attachments], completion: calcCompletion(mockResume) },

  setBasicInfo: (info) => {
    set((state) => {
      const newResume = { ...state.resume, ...info };
      return { resume: { ...newResume, completion: calcCompletion(newResume) } };
    });
  },

  addWorkExperience: (exp) => {
    const newExp: WorkExperience = {
      ...exp,
      id: Date.now().toString(),
    };
    set((state) => {
      const newResume = {
        ...state.resume,
        workExperiences: [newExp, ...state.resume.workExperiences],
      };
      return { resume: { ...newResume, completion: calcCompletion(newResume) } };
    });
  },

  updateWorkExperience: (id, exp) => {
    set((state) => {
      const newResume = {
        ...state.resume,
        workExperiences: state.resume.workExperiences.map((e) =>
          e.id === id ? { ...e, ...exp } : e
        ),
      };
      return { resume: { ...newResume, completion: calcCompletion(newResume) } };
    });
  },

  removeWorkExperience: (id) => {
    set((state) => {
      const newResume = {
        ...state.resume,
        workExperiences: state.resume.workExperiences.filter((e) => e.id !== id),
      };
      return { resume: { ...newResume, completion: calcCompletion(newResume) } };
    });
  },

  setSkills: (skills) => {
    set((state) => {
      const newResume = { ...state.resume, skills };
      return { resume: { ...newResume, completion: calcCompletion(newResume) } };
    });
  },

  addSkill: (skill) => {
    set((state) => {
      const newSkills = state.resume.skills.includes(skill)
        ? state.resume.skills
        : [...state.resume.skills, skill];
      const newResume = { ...state.resume, skills: newSkills };
      return { resume: { ...newResume, completion: calcCompletion(newResume) } };
    });
  },

  removeSkill: (skill) => {
    set((state) => {
      const newResume = {
        ...state.resume,
        skills: state.resume.skills.filter((s) => s !== skill),
      };
      return { resume: { ...newResume, completion: calcCompletion(newResume) } };
    });
  },

  setExpectation: (expectation) => {
    set((state) => {
      const newResume = { ...state.resume, ...expectation };
      return { resume: { ...newResume, completion: calcCompletion(newResume) } };
    });
  },

  addAttachment: (attachment) => {
    const newAtt: AttachmentItem = {
      ...attachment,
      id: Date.now().toString(),
    };
    set((state) => {
      const newResume = {
        ...state.resume,
        attachments: [newAtt, ...state.resume.attachments],
      };
      return { resume: { ...newResume, completion: calcCompletion(newResume) } };
    });
  },

  removeAttachment: (id) => {
    set((state) => {
      const newResume = {
        ...state.resume,
        attachments: state.resume.attachments.filter((a) => a.id !== id),
      };
      return { resume: { ...newResume, completion: calcCompletion(newResume) } };
    });
  },

  calculateCompletion: () => {
    return get().resume.completion || calcCompletion(get().resume);
  },
}));
