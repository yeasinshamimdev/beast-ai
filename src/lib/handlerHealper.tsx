import { Model } from "@/types/aiModels";
import { ActionNode } from "@/types/workflow";
import { Node } from "reactflow";

// Move helper functions outside to reduce complexity
export const calculateNodePosition = (
  parentNode: Node | null
): { x: number; y: number } => {
  // Implementation would go here - extracted for clarity
  // Example implementation:
  if (!parentNode) {
    return { x: 100, y: 100 }; // Starting position
  }

  // Calculate position based on parent with some offset
  return {
    x: parentNode.position.x + 250,
    y: parentNode.position.y + 50,
  };
};

// Define parameter types
export interface ParameterDefaults {
  api_key: string;
  endpoint: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  model?: string | string[];
  n?: number;
  quality?: string | string[];
  size?: string | string[];
  [key: string]: any; // For additional parameters
}

// Extract parameter processing to a separate function
export const processParameters = (
  params: ParameterDefaults | undefined
): ParameterDefaults => {
  if (!params) return { api_key: "", endpoint: "", prompt: "" };

  // Universal default parameters
  const UNIVERSAL_DEFAULTS: ParameterDefaults = {
    api_key: "",
    endpoint: "",
    prompt: "",
  };

  // Handle numeric parameters with min/max/default
  const handleNumericParam = (name: string): number | undefined => {
    if (params?.[name]?.default !== undefined) {
      return params[name].default;
    }
    return undefined;
  };

  // Handle model selection (array or string)
  const handleModelSelection = (): string => {
    if (!params?.model) return "";
    return Array.isArray(params.model)
      ? params.model[0]
      : (params.model as string);
  };

  // Handle array parameters
  const handleArrayParam = (name: string): string | undefined => {
    if (!params?.[name]) return undefined;
    return Array.isArray(params[name])
      ? params[name][0]
      : (params[name] as string);
  };

  return {
    ...UNIVERSAL_DEFAULTS,
    ...params,
    // Common numeric parameters
    ...(params?.max_tokens && { max_tokens: handleNumericParam("max_tokens") }),
    ...(params?.temperature && {
      temperature: handleNumericParam("temperature"),
    }),
    // Model selection
    model: handleModelSelection(),
    // Model-specific parameters
    ...(params?.n && { n: handleNumericParam("n") }),
    quality: handleArrayParam("quality"),
    size: handleArrayParam("size"),
    // Add other model-specific parameters as needed
  };
};

export const checkNodeType = (model: Model | ActionNode): boolean => {
  return ["preview", "button", "output_sender", "wait"].includes(
    model?.output_type as any
  );
};
