import { Node, Edge } from 'reactflow';
import { AiModelConfig } from './aiModels';

export interface AiNodeData {
  label: string;
  config: AiModelConfig; 
}

export interface WorkflowData {
  nodes: Node<AiNodeData>[];
  edges: Edge[];
  title: string;
  createdAt: any;
  updatedAt: string;
  isActive: any;
}
