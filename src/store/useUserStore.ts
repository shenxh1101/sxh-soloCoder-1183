import { create } from 'zustand';
import type { UserRole } from '@/types';

interface UserState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: 'seeker',
  setRole: (role) => set({ role }),
  toggleRole: () =>
    set((state) => ({
      role: state.role === 'seeker' ? 'company' : 'seeker',
    })),
}));
