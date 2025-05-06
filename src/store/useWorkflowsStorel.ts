 
import { WorkflowData } from "@/types/workflow";
import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  workflows: WorkflowData[];
};

type Actions = {
  setWorkflows: (workflow: WorkflowData) => void;
  toggleActive: (id: string) => void;
  removeSingleWorkFlow: (id: string) => void;
  removeAllWorkflow: () => void;
};

export type NodeModelStore = State & Actions;

export const useWorkflowsStore = createStore<NodeModelStore>()(
  persist(
    (set) => ({
      workflows: [],

      setWorkflows: (workflow) =>
        set((state) => {
          const exists = state.workflows.some((w) => w.id === workflow.id);
          const updatedWorkflows = exists
            ? state.workflows.map((w) =>
                w.id === workflow.id ? { ...w, ...workflow } : w
              )
            : [...state.workflows, workflow];

          return { workflows: updatedWorkflows };
        }),

      toggleActive: (id) =>
        set((state) => ({
          workflows: state.workflows.map((flow) =>
            flow.id === id
              ? {
                  ...flow,
                  isActive: !flow.isActive,
                  updatedAt: new Date().toLocaleString(),
                }
              : flow
          ),
        })),

      removeSingleWorkFlow: (id) =>
        set((state) => ({
          workflows: state.workflows.filter((w) => w.id !== id),
        })),

      removeAllWorkflow: () => set({ workflows: [] }),
    }),
    {
      name: "workflow-nodes",
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          const data: WorkflowData[] = item ? JSON.parse(item) : [];
          return { state: { workflows: data } };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value.state.workflows));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
      onRehydrateStorage: () => () => {},
    }
  )
);

export const useWorkflowModelStore = () => useStore(useWorkflowsStore);
