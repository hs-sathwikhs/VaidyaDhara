// src/store/index.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Chat Store
export const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  userLocation: 'India',
  
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, id: Date.now(), timestamp: new Date() }]
    })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setLocation: (location) => set({ userLocation: location }),
  
  clearMessages: () => set({ messages: [] }),
  
  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter(msg => msg.id !== id)
    })),
}));

// User Store with persistence
export const useUserStore = create(
  persist(
    (set, get) => ({
      profile: {
        name: 'Guest User',
        email: '',
        age: 0,
        location: 'India',
        preferredLanguage: 'en',
        points: 0,
        badges: [],
        healthGoals: [],
        joinDate: new Date().toISOString(),
      },
      isAuthenticated: false,
      
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates }
        })),
      
      addPoints: (points, activity) =>
        set((state) => ({
          profile: {
            ...state.profile,
            points: state.profile.points + points
          }
        })),
      
      unlockBadge: (badge) =>
        set((state) => ({
          profile: {
            ...state.profile,
            badges: [...new Set([...state.profile.badges, badge])]
          }
        })),
      
      setAuthenticated: (auth) => set({ isAuthenticated: auth }),
      
      // Level calculation based on points
      getLevel: () => {
        const points = get().profile.points;
        if (points < 100) return 'Beginner';
        if (points < 500) return 'Intermediate';
        if (points < 1000) return 'Advanced';
        return 'Expert';
      },
      
      // Points needed for next level
      getPointsToNextLevel: () => {
        const points = get().profile.points;
        if (points < 100) return 100 - points;
        if (points < 500) return 500 - points;
        if (points < 1000) return 1000 - points;
        return 0;
      },
    }),
    {
      name: 'vaidya-dhara-user',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profile: state.profile, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Health Data Store
export const useHealthStore = create((set, get) => ({
  symptoms: [],
  healthTips: [],
  emergencyContacts: [],
  analytics: null,
  
  addSymptom: (symptom) =>
    set((state) => ({
      symptoms: [...state.symptoms, { ...symptom, id: Date.now(), date: new Date() }]
    })),
  
  removeSymptom: (id) =>
    set((state) => ({
      symptoms: state.symptoms.filter(s => s.id !== id)
    })),
  
  setHealthTips: (tips) => set({ healthTips: tips }),
  
  addHealthTip: (tip) =>
    set((state) => ({
      healthTips: [...state.healthTips, tip]
    })),
  
  setEmergencyContacts: (contacts) => set({ emergencyContacts: contacts }),
  
  setAnalytics: (data) => set({ analytics: data }),
  
  // Get symptoms by date range
  getSymptomsByDateRange: (startDate, endDate) => {
    const symptoms = get().symptoms;
    return symptoms.filter(symptom => {
      const symptomDate = new Date(symptom.date);
      return symptomDate >= startDate && symptomDate <= endDate;
    });
  },
  
  // Get favorite health tips
  getFavoriteHealthTips: () => {
    const tips = get().healthTips;
    return tips.filter(tip => tip.isFavorite);
  },
}));

// UI State Store
export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  currentTheme: 'light',
  notifications: [],
  modalOpen: null,
  
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  setTheme: (theme) => set({ currentTheme: theme }),
  
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, {
        ...notification,
        id: Date.now(),
        timestamp: new Date()
      }]
    })),
  
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),
  
  clearNotifications: () => set({ notifications: [] }),
  
  setModalOpen: (modal) => set({ modalOpen: modal }),
  
  closeModal: () => set({ modalOpen: null }),
}));

// Language and Localization Store
export const useLocalizationStore = create(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      availableLanguages: [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'hi', name: 'Hindi', native: 'हिंदी' },
        { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
        { code: 'bn', name: 'Bengali', native: 'বাংলা' },
        { code: 'te', name: 'Telugu', native: 'తెలుగు' },
        { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
        { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
      ],
      
      setLanguage: (languageCode) => {
        set({ currentLanguage: languageCode });
        // Also update user profile
        const userStore = useUserStore.getState();
        userStore.updateProfile({ preferredLanguage: languageCode });
      },
      
      getLanguageName: (code) => {
        const lang = get().availableLanguages.find(l => l.code === code);
        return lang ? lang.name : 'Unknown';
      },
      
      getNativeName: (code) => {
        const lang = get().availableLanguages.find(l => l.code === code);
        return lang ? lang.native : 'Unknown';
      },
    }),
    {
      name: 'vaidya-dhara-lang',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default {
  useChatStore,
  useUserStore,
  useHealthStore,
  useUIStore,
  useLocalizationStore,
};
