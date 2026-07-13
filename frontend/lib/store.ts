import { create } from 'zustand';

interface AppState {
  // Simulator State
  addEPFO: boolean;
  addUtility: boolean;
  setAddEPFO: (val: boolean) => void;
  setAddUtility: (val: boolean) => void;
  
  // AI Loading State
  isAIGenerating: boolean;
  setAIGenerating: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  addEPFO: false,
  addUtility: false,
  setAddEPFO: (val) => set({ addEPFO: val }),
  setAddUtility: (val) => set({ addUtility: val }),
  
  isAIGenerating: false,
  setAIGenerating: (val) => set({ isAIGenerating: val }),
}));