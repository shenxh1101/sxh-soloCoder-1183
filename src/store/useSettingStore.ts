import { create } from 'zustand';

interface BlacklistItem {
  id: string;
  name: string;
  avatar: string;
  type: 'company' | 'seeker';
  addedAt: string;
  reason?: string;
}

interface PrivacySettings {
  resumeVisible: boolean;
  showPhone: boolean;
  showEmail: boolean;
  allowCompanyView: boolean;
  hideFromCurrentCompany: boolean;
}

interface SettingState {
  privacy: PrivacySettings;
  blacklist: BlacklistItem[];
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  addToBlacklist: (item: Omit<BlacklistItem, 'id' | 'addedAt'>) => void;
  removeFromBlacklist: (id: string) => void;
  isBlacklisted: (name: string) => boolean;
}

export const useSettingStore = create<SettingState>((set, get) => ({
  privacy: {
    resumeVisible: true,
    showPhone: true,
    showEmail: true,
    allowCompanyView: true,
    hideFromCurrentCompany: false,
  },

  blacklist: [
    {
      id: '1',
      name: '不良中介公司',
      avatar: 'https://picsum.photos/id/3/200/200',
      type: 'company',
      addedAt: '2026-05-20',
      reason: '频繁骚扰',
    },
  ],

  updatePrivacy: (settings) => {
    set((state) => ({
      privacy: { ...state.privacy, ...settings },
    }));
  },

  addToBlacklist: (item) => {
    const newItem: BlacklistItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({
      blacklist: [newItem, ...state.blacklist],
    }));
  },

  removeFromBlacklist: (id) => {
    set((state) => ({
      blacklist: state.blacklist.filter((item) => item.id !== id),
    }));
  },

  isBlacklisted: (name) => {
    return get().blacklist.some((item) => item.name === name);
  },
}));
