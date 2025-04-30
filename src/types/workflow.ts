import { Node, Edge } from 'reactflow';
import {   Model } from './aiModels';

export interface AiNodeData {
  label: string;
  config: Model; 
  isTrigger?: boolean;
}

export interface WorkflowData {
  nodes: Node<AiNodeData>[];
  edges: Edge[];
  title: string;
  createdAt: any;
  updatedAt: string;
  isActive: any;
}
