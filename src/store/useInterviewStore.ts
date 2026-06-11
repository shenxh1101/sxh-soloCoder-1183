import { create } from 'zustand';
import type { Interview } from '@/types';
import { mockInterviews } from '@/data/interviews';

interface InterviewState {
  interviews: Interview[];
  getInterviewById: (id: string) => Interview | undefined;
  confirmInterview: (id: string) => void;
  rescheduleInterview: (id: string, newTime: string, reason?: string) => void;
  recordResult: (id: string, result: 'passed' | 'failed' | 'pending', notes?: string) => void;
  cancelInterview: (id: string) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  getUpcomingInterviews: () => Interview[];
  getCompletedInterviews: () => Interview[];
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  interviews: mockInterviews,

  getInterviewById: (id: string) => {
    return get().interviews.find((i) => i.id === id);
  },

  confirmInterview: (id: string) => {
    set((state) => ({
      interviews: state.interviews.map((i) =>
        i.id === id ? { ...i, status: 'confirmed' } : i
      ),
    }));
  },

  rescheduleInterview: (id: string, newTime: string, reason = '候选人申请改期') => {
    set((state) => ({
      interviews: state.interviews.map((i) =>
        i.id === id
          ? { ...i, status: 'rescheduled', time: newTime, notes: reason }
          : i
      ),
    }));
  },

  recordResult: (id: string, result, notes = '') => {
    set((state) => ({
      interviews: state.interviews.map((i) =>
        i.id === id ? { ...i, status: 'completed', result, notes: notes || i.notes } : i
      ),
    }));
  },

  cancelInterview: (id: string) => {
    set((state) => ({
      interviews: state.interviews.map((i) =>
        i.id === id ? { ...i, status: 'cancelled' } : i
      ),
    }));
  },

  updateInterview: (id: string, updates: Partial<Interview>) => {
    set((state) => ({
      interviews: state.interviews.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    }));
  },

  addInterview: (interview) => {
    const newInterview: Interview = {
      ...interview,
      id: Date.now().toString(),
    };
    set((state) => ({
      interviews: [newInterview, ...state.interviews],
    }));
  },

  getUpcomingInterviews: () => {
    return get().interviews.filter(
      (i) => i.status === 'pending' || i.status === 'confirmed' || i.status === 'rescheduled'
    );
  },

  getCompletedInterviews: () => {
    return get().interviews.filter(
      (i) => i.status === 'completed' || i.status === 'cancelled'
    );
  },
}));
