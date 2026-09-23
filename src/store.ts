import { create } from 'zustand';
import { Job, JobStatus } from './types/job';
import { ToolDefinition } from './types/tool';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  // Jobs
  jobs: Job[];
  activeJobId: string | null;
  
  // Actions
  addJob: (tool: ToolDefinition, files: File[], options: Record<string, any>) => string;
  updateJob: (id: string, updates: Partial<Job>) => void;
  removeJob: (id: string) => void;
  clearJobs: () => void;
  setActiveJob: (id: string | null) => void;
  
  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Recent files
  recentTools: string[];
  addRecentTool: (slug: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  jobs: [],
  activeJobId: null,
  sidebarOpen: true,
  searchQuery: '',
  recentTools: [],

  addJob: (tool, files, options) => {
    const id = uuidv4();
    const job: Job = {
      id,
      toolSlug: tool.slug,
      toolTitle: tool.title,
      status: 'queued',
      progress: 0,
      inputFiles: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
      outputFiles: [],
      options,
      warnings: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set(state => ({ jobs: [job, ...state.jobs] }));
    return id;
  },

  updateJob: (id, updates) => {
    set(state => ({
      jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates, updatedAt: Date.now() } : j),
    }));
  },

  removeJob: (id) => {
    set(state => ({ jobs: state.jobs.filter(j => j.id !== id) }));
  },

  clearJobs: () => set({ jobs: [] }),

  setActiveJob: (id) => set({ activeJobId: id }),

  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  addRecentTool: (slug) => {
    set(state => {
      const recent = [slug, ...state.recentTools.filter(s => s !== slug)].slice(0, 10);
      return { recentTools: recent };
    });
  },
}));
