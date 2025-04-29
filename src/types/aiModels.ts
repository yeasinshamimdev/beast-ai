export interface AiModelConfig { 
    name: string;
    type: 'text' | 'image' | 'voice' | 'audio' | 'video';
    params: string[];
    isTrigger?: boolean
  }
  