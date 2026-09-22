export type JobStatus = 'queued' | 'analyzing' | 'processing' | 'validating' | 'ready' | 'failed' | 'downloaded';

export interface Job {
  id: string;
  toolSlug: string;
  toolTitle: string;
  status: JobStatus;
  progress: number;
  inputFiles: { name: string; size: number; type: string }[];
  outputFiles: { name: string; blob?: Blob; url?: string; size?: number }[];
  options: Record<string, any>;
  warnings: string[];
  error?: { code: string; message: string; detail?: string };
  createdAt: number;
  updatedAt: number;
}

export interface JobQueue {
  jobs: Job[];
  activeJobId: string | null;
  totalProcessed: number;
}
