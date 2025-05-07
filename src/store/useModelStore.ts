import { create } from 'zustand';
import { Model } from '@/types/aiModels';

interface ModelState {
  models: Model[] | null;
  setModels: (models: Model[]) => void;

  singleModel: Model | null;
  setSingleModel: (model: Model) => void;
}

export const useModelStore = create<ModelState>((set) => ({
  models: null,
  setModels: (models) => set({ models }),

  singleModel: null,
  setSingleModel: (model) => set({ singleModel: model }),
}));


