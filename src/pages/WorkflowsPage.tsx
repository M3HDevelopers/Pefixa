import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toolRegistry } from '../lib/tools/registry';
import { Workflow, WorkflowStep } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';
import {
  Plus,
  Play,
  Trash2,
  GripVertical,
  ArrowRight,
  GitBranch,
  Save,
  FolderOpen,
} from 'lucide-react';

const presetWorkflows: Workflow[] = [
  {
    id: 'preset-1',
    name: 'Prepare for Email',
    description: 'Compress and protect PDF for email sharing',
    steps: [
      { id: '1', toolSlug: 'compress-pdf', options: { level: 'recommended' }, order: 0 },
      { id: '2', toolSlug: 'encrypt-pdf', options: { userPassword: '', ownerPassword: '' }, order: 1 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPreset: true,
  },
  {
    id: 'preset-2',
    name: 'Split & Organize',
    description: 'Split large PDF and rotate pages',
    steps: [
      { id: '1', toolSlug: 'split-pdf', options: { mode: 'ranges', ranges: '1-5' }, order: 0 },
      { id: '2', toolSlug: 'rotate-pages', options: { angle: '90', pages: 'all' }, order: 1 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPreset: true,
  },
  {
    id: 'preset-3',
    name: 'Document Pipeline',
    description: 'Merge, add watermark, and compress',
    steps: [
      { id: '1', toolSlug: 'merge-pdf', options: {}, order: 0 },
      { id: '2', toolSlug: 'watermark-text', options: { text: 'DRAFT', opacity: 0.3 }, order: 1 },
      { id: '3', toolSlug: 'compress-pdf', options: { level: 'recommended' }, order: 2 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPreset: true,
  },
  {
    id: 'preset-4',
    name: 'Sanitize & Share',
    description: 'Remove metadata, flatten, and compress',
    steps: [
      { id: '1', toolSlug: 'remove-metadata', options: {}, order: 0 },
      { id: '2', toolSlug: 'flatten-pdf', options: {}, order: 1 },
      { id: '3', toolSlug: 'compress-pdf', options: { level: 'high' }, order: 2 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPreset: true,
  },
];

export function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(presetWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newSteps, setNewSteps] = useState<WorkflowStep[]>([]);

  const createWorkflow = () => {
    if (!newName.trim()) return;
    const workflow: Workflow = {
      id: uuidv4(),
      name: newName,
      description: 'Custom workflow',
      steps: newSteps,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPreset: false,
    };
    setWorkflows(prev => [...prev, workflow]);
    setShowCreate(false);
    setNewName('');
    setNewSteps([]);
  };

  const addStep = (toolSlug: string) => {
    setNewSteps(prev => [...prev, {
      id: uuidv4(),
      toolSlug,
      options: {},
      order: prev.length,
    }]);
  };

  const removeStep = (stepId: string) => {
    setNewSteps(prev => prev.filter(s => s.id !== stepId));
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    if (selectedWorkflow?.id === id) setSelectedWorkflow(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GitBranch size={24} className="text-blue-600" />
            Workflows
          </h1>
          <p className="text-sm text-gray-500">Chain tools together for automated PDF processing</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={14} />
          New Workflow
        </button>
      </div>

      {/* Create New */}
      {showCreate && (
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-3">Create Workflow</h3>
          <input
            type="text"
            placeholder="Workflow name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 focus:outline-none focus:border-blue-300"
          />
          
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-600 mb-2">Add steps:</p>
            <div className="flex flex-wrap gap-1.5">
              {toolRegistry.filter(t => t.capability === 'browser-ready').map(tool => (
                <button
                  key={tool.slug}
                  onClick={() => addStep(tool.slug)}
                  className="px-2 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded text-xs text-gray-600 transition-colors"
                >
                  + {tool.title}
                </button>
              ))}
            </div>
          </div>

          {newSteps.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-600 mb-2">Steps ({newSteps.length}):</p>
              <div className="space-y-1">
                {newSteps.map((step, i) => {
                  const tool = toolRegistry.find(t => t.slug === step.toolSlug);
                  return (
                    <div key={step.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-400 w-5">{i + 1}.</span>
                      <span className="text-xs text-gray-700 flex-1">{tool?.title || step.toolSlug}</span>
                      <button onClick={() => removeStep(step.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={createWorkflow}
              disabled={!newName.trim() || newSteps.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400"
            >
              <Save size={12} />
              Save Workflow
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Workflow List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map(workflow => (
          <div
            key={workflow.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-gray-900 text-sm">{workflow.name}</h3>
                <p className="text-xs text-gray-500">{workflow.description}</p>
              </div>
              <div className="flex items-center gap-1">
                {workflow.isPreset && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">Preset</span>
                )}
                <button
                  onClick={() => deleteWorkflow(workflow.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Trash2 size={12} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-1 flex-wrap mt-3">
              {workflow.steps.map((step, i) => {
                const tool = toolRegistry.find(t => t.slug === step.toolSlug);
                return (
                  <div key={step.id} className="flex items-center gap-1">
                    <span className="px-2 py-1 bg-gray-100 rounded text-[10px] text-gray-700 font-medium">
                      {tool?.title || step.toolSlug}
                    </span>
                    {i < workflow.steps.length - 1 && (
                      <ArrowRight size={10} className="text-gray-300" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                <Play size={10} />
                Run Workflow
              </button>
              <button
                onClick={() => setSelectedWorkflow(workflow)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200"
              >
                <FolderOpen size={10} />
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h3 className="text-sm font-medium text-blue-900 mb-1">About Workflows</h3>
        <p className="text-xs text-blue-700">
          Workflows let you chain multiple PDF tools together. Process files through a sequence of operations
          automatically. In the frontend phase, workflows show the intended pipeline — full automation
          will be available when the backend processing layer is connected.
        </p>
      </div>
    </div>
  );
}
