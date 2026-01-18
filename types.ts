
export enum AppTab {
  HOME = 'home',
  STUDIO = 'studio',
  WRITER = 'writer',
  BRANDING = 'branding',
  HISTORY = 'history'
}

export interface GeneratedContent {
  id: string;
  type: 'image' | 'text' | 'story' | 'mascot';
  content: string;
  title: string;
  timestamp: number;
}

export interface ImagePromptOptions {
  backgroundType: string;
  lighting: string;
  style: string;
}

export interface WritingPromptOptions {
  productName: string;
  description: string;
  tone: string;
  target: 'caption' | 'stories' | 'whatsapp';
}
