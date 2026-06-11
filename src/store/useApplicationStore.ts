import { create } from 'zustand';
import type { Application } from '@/types';
import { mockApplications } from '@/data/profile';

interface ApplicationState {
  applications: Application[];
  getApplicationsByJob: (jobId?: string) => Application[];
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  addApplication: (application: Omit<Application, 'id' | 'appliedAt' | 'status'> & { jobId: string }) => void;
  getApplicationsByStatus: (status: Application['status']) => Application[];
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: mockApplications,

  getApplicationsByJob: (jobId) => {
    if (!jobId) return get().applications;
    return get().applications.filter((a) => a.jobTitle === jobId);
  },

  updateApplicationStatus: (id, status) => {
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    }));
  },

  addApplication: (application) => {
    const newApp: Application = {
      id: Date.now().toString(),
      jobTitle: application.jobTitle,
      companyName: application.companyName,
      applicantName: application.applicantName,
      applicantAvatar: application.applicantAvatar,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    set((state) => ({
      applications: [newApp, ...state.applications],
    }));
  },

  getApplicationsByStatus: (status) => {
    return get().applications.filter((a) => a.status === status);
  },
}));
