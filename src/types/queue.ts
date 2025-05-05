export type NodeType = 'wait' | 'preview' | 'button' | 'text' | 'api'; // Add more as needed

export interface QueueResult {
  nodeId: string;
  data: any;
  timestamp: number;
}

export interface QueueState {
  isRunning: boolean;
  results: Record<string, QueueResult>;
  currentNode: string | null;
  queue: string[];
  error: string | null;
  executionTime: number;
}