import { create } from 'zustand';
import type { Job } from '@/types';
import { mockJobs } from '@/data/jobs';
import { mockUserProfile } from '@/data/profile';
import { useUserStore } from './useUserStore';

interface JobState {
  jobs: Job[];
  getJobById: (id: string) => Job | undefined;
  toggleBookmark: (id: string) => void;
  applyJob: (id: string) => void;
  addJob: (job: Job) => void;
  getBookmarkedJobs: () => Job[];
  getAppliedJobs: () => Job[];
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: mockJobs,

  getJobById: (id: string) => {
    return get().jobs.find((job) => job.id === id);
  },

  toggleBookmark: (id: string) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, isBookmarked: !job.isBookmarked } : job
      ),
    }));
  },

  applyJob: (id: string) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, isApplied: true } : job
      ),
    }));
  },

  addJob: (job: Job) => {
    const userRole = useUserStore.getState().role;
    const companyName = userRole === 'company' ? mockUserProfile.companyName : job.company;
    const companyLogo = userRole === 'company' ? mockUserProfile.companyLogo : job.companyLogo;

    set((state) => ({
      jobs: [
        {
          ...job,
          id: Date.now().toString(),
          company: companyName,
          companyLogo: companyLogo,
          isBookmarked: false,
          isApplied: false,
          publishedAt: new Date().toISOString().split('T')[0],
        },
        ...state.jobs,
      ],
    }));
  },

  getBookmarkedJobs: () => {
    return get().jobs.filter((job) => job.isBookmarked);
  },

  getAppliedJobs: () => {
    return get().jobs.filter((job) => job.isApplied);
  },
}));
