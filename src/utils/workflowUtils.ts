import { WorkflowData } from "../types/workflow";

export const saveWorkflow = (id: string, data: WorkflowData) => {
  localStorage.setItem(`workflow_${id}`, JSON.stringify(data));
};

export const loadWorkflow = (id: string): WorkflowData | null => {
  const data = localStorage.getItem(`workflow_${id}`);
  return data ? JSON.parse(data) : null;
};

// we can remove these code.
