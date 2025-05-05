import { QueueState } from '@/types/queue';
import { create } from 'zustand';

interface WorkflowStore {
  workflowState: QueueState;
  updateState: (newState: Partial<QueueState>) => void;
  resetState: () => void;
}

export const useWorkflowQueueStore = create<WorkflowStore>((set) => ({
  workflowState: {
    isRunning: false,
    results: {},
    currentNode: null,
    queue: [],
    error: null,
    executionTime: 0,
  },
  updateState: (newState) => 
    set((state) => ({ 
      workflowState: { ...state.workflowState, ...newState } 
    })),
  resetState: () => 
    set({ 
      workflowState: {
        isRunning: false,
        results: {},
        currentNode: null,
        queue: [],
        error: null,
        executionTime: 0,
      }
    }),
}));