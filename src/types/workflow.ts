import { Edge, Node } from "reactflow";
import { Model } from "./aiModels";
export interface ActionNode {
  output_type: "wait" | "output_sender" | "button" | "preview";
  name: string;
  label?: string;
  logo?: string;
  parameters?: {
    [key: string]: any;
  };
  id?: string;
  provider?: string;
}

export interface AiNodeData {
  label: string;
  config: Model | ActionNode;
  isTrigger?: boolean;
}

export interface WorkflowData {
  id: string;
  nodes: Node<AiNodeData>[];
  edges: Edge[];
  title: string;
  createdAt: any;
  updatedAt: string;
  isActive: any;
}
