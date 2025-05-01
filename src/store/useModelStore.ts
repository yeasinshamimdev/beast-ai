import { create } from 'zustand';
import { Model } from '@/types/aiModels';

interface ModelState {
  models: Model[] | null;
  setModels: (models: Model[]) => void;
}

export const useModelStore = create<ModelState>((set) => ({
  models: null,
  setModels: (models) => set({ models }),
}));
