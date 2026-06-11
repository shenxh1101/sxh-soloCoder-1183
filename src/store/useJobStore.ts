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
          id: Date.now().toString(),
          title: job.title,
          company: companyName,
          companyLogo: companyLogo,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          location: job.location,
          experience: job.experience || '不限',
          education: job.education || '不限',
          type: job.type || '全职',
          tags: (job.tags && job.tags.length > 0) ? job.tags : (job.welfare || ['五险一金']),
          description: job.description || '该岗位暂无详细描述，请投递简历后与HR沟通。',
          requirements: (job.requirements && job.requirements.length > 0)
            ? job.requirements
            : ['相关专业背景优先', '有良好的沟通能力', '具备团队协作精神'],
          benefits: (job.benefits && job.benefits.length > 0)
            ? job.benefits
            : (job.welfare || ['五险一金', '年终奖', '带薪年假']),
          welfare: job.welfare,
          publishedAt: new Date().toISOString().split('T')[0],
          isBookmarked: false,
          isApplied: false,
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
