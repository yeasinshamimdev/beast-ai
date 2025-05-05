export interface AiModelConfig {
  name: string;
  type: "text" | "image" | "voice" | "audio" | "video";
  params: string[];
  isTrigger?: boolean;
}

export interface RangeParam {
  min: number;
  max: number;
  default?: number;
}

export type ParameterValue =
  | string
  | string[]
  | RangeParam
  | {
      min: number;
      max: number;
      default?: number;
    };

export interface ModelBase {
  logo: string;
  name: string;
  output_type: "text" | "image" | "voice" | "audio" | "video" | string[];
  provider: string;
  id?:string
}

export interface ModelWithParameters extends ModelBase {
  parameters: Record<string, ParameterValue>;
}

export type Model = ModelWithParameters;

export interface ModelData {
  models: Model[];
}
