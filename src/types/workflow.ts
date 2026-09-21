export interface WorkflowStep {
  id: string;
  toolSlug: string;
  options: Record<string, any>;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt: number;
  updatedAt: number;
  isPreset: boolean;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  startedAt: number;
  completedAt?: number;
}
