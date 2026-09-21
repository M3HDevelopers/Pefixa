export type CapabilityState = 'browser-ready' | 'browser-partial' | 'backend-required' | 'ai-required';

export type ToolCategory =
  | 'merge-split'
  | 'convert'
  | 'compress'
  | 'edit'
  | 'security'
  | 'organize'
  | 'ocr'
  | 'extract'
  | 'inspect'
  | 'compare'
  | 'forms'
  | 'ai'
  | 'optimize'
  | 'accessibility';

export interface ToolOption {
  key: string;
  label: string;
  type: 'select' | 'number' | 'boolean' | 'text' | 'range';
  default: any;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ToolDefinition {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: string;
  capability: CapabilityState;
  acceptsMultiple: boolean;
  acceptedTypes: string[];
  maxFileSizeMB: number;
  options: ToolOption[];
  outputType: string;
  outputMultiple: boolean;
  supportsBatch: boolean;
  supportsChaining: boolean;
}

export interface ToolInput {
  files: File[];
  options: Record<string, any>;
}

export interface ToolOutput {
  files: { name: string; blob: Blob; url?: string }[];
  warnings: string[];
  metadata: Record<string, any>;
}
