export type CapabilityState = 'browser-ready' | 'browser-partial' | 'backend-required' | 'ai-required';

export type ToolCategory =
  | 'organize'
  | 'edit'
  | 'forms'
  | 'convert-from'
  | 'convert-to'
  | 'pdf-to-office'
  | 'office-to-pdf'
  | 'compress'
  | 'ocr'
  | 'security'
  | 'inspect'
  | 'extract'
  | 'ai'
  | 'workflows'
  | 'create'
  | 'developer';

export type InputMode = 'single' | 'multiple' | 'any';

export interface ToolOption {
  key: string;
  label: string;
  description?: string;
  type: 'select' | 'number' | 'boolean' | 'text' | 'range' | 'file' | 'color';
  default: any;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  group?: string;
}

export interface OutputContract {
  mime: string;
  extension: string;
  multiple: boolean;
  zipAllowed: boolean;
}

export interface ToolDefinition {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  aliases: string[];
  icon: string;
  capability: CapabilityState;
  inputMode: InputMode;
  acceptedTypes: string[];
  maxFileSizeMB: number;
  options: ToolOption[];
  output: OutputContract;
  supportsBatch: boolean;
  supportsChaining: boolean;
  supportsPreview: boolean;
  processorId: string;
  progressType: 'indeterminate' | 'percentage';
  errorCodes: string[];
  storeInHistory: boolean;
  localOnlyCapable: boolean;
}

export interface ToolInput {
  files: File[];
  options: Record<string, any>;
  signal?: AbortSignal;
}

export interface ToolOutput {
  files: { name: string; blob: Blob; url?: string }[];
  warnings: string[];
  metadata?: Record<string, any>;
}

export interface ToolError {
  code: string;
  message: string;
  userMessage: string;
  detail?: string;
  recoverable: boolean;
}
