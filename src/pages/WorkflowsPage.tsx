import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toolRegistry } from '../lib/tools/registry';
import { Workflow, WorkflowStep } from '../types/workflow';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Play, Trash2, ArrowRight, GitBranch, Save, FileText } from 'lucide-react';
import { RevealSection } from '../components/RevealSection';

const presetWorkflows: Workflow[] = [
  { id: 'preset-1', name: 'Prepare for Email', description: 'Compress and protect PDF', steps: [{ id: '1', toolSlug: 'compress-pdf', options: { level: 'recommended' }, order: 0 }, { id: '2', toolSlug: 'encrypt-pdf', options: {}, order: 1 }], createdAt: Date.now(), updatedAt: Date.now(), isPreset: true },
  { id: 'preset-2', name: 'Split & Organize', description: 'Split and rotate pages', steps: [{ id: '1', toolSlug: 'split-pdf', options: { mode: 'ranges' }, order: 0 }, { id: '2', toolSlug: 'rotate-pages', options: { angle: '90' }, order: 1 }], createdAt: Date.now(), updatedAt: Date.now(), isPreset: true },
  { id: 'preset-3', name: 'Document Pipeline', description: 'Merge, watermark, compress', steps: [{ id: '1', toolSlug: 'merge-pdf', options: {}, order: 0 }, { id: '2', toolSlug: 'watermark-text', options: { text: 'DRAFT' }, order: 1 }, { id: '3', toolSlug: 'compress-pdf', options: {}, order: 2 }], createdAt: Date.now(), updatedAt: Date.now(), isPreset: true },
];

export function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(presetWorkflows);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSteps, setNewSteps] = useState<WorkflowStep[]>([]);
  const [runningWorkflow, setRunningWorkflow] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const createWorkflow = () => {
    if (!newName.trim()) return;
    const workflow: Workflow = { id: uuidv4(), name: newName, description: 'Custom workflow', steps: newSteps, createdAt: Date.now(), updatedAt: Date.now(), isPreset: false };
    setWorkflows(prev => [...prev, workflow]);
    setShowCreate(false);
    setNewName('');
    setNewSteps([]);
  };

  const addStep = (toolSlug: string) => {
    setNewSteps(prev => [...prev, { id: uuidv4(), toolSlug, options: {}, order: prev.length }]);
  };

  const runWorkflow = (workflowId: string) => {
    setRunningWorkflow(workflowId);
    // Simulate workflow execution
    setTimeout(() => {
      setRunningWorkflow(null);
      alert('Workflow completed successfully!');
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <RevealSection>
        <div className="flex items-center justify-between mb-6 pr-36">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <GitBranch size={22} className="text-white" />
              Workflows
            </h1>
            <p className="text-[13px] text-[#888]">Chain tools together for automated PDF processing</p>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-1 px-3 py-2 btn-primary text-[12px]">
            <Plus size={13} />
            New Workflow
          </button>
        </div>
      </RevealSection>

      {showCreate && (
        <div className="mb-6 card p-4 animate-fade-in-up">
          <h3 className="font-medium text-white mb-3 text-[13px]">Create Workflow</h3>
          <input type="text" placeholder="Workflow name..." value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-3 py-2 input-dark text-[12px] mb-3" />
          <div className="mb-3">
            <p className="text-[11px] font-medium text-[#888] mb-2">Add steps:</p>
            <div className="flex flex-wrap gap-1.5">
              {toolRegistry.filter(t => t.capability === 'browser-ready').slice(0, 20).map(tool => (
                <button key={tool.slug} onClick={() => addStep(tool.slug)} className="px-2 py-1 bg-[#111] border border-[#1f1f1f] hover:border-[#333] rounded-sm text-[10px] text-[#888] hover:text-white transition-colors">
                  + {tool.title}
                </button>
              ))}
            </div>
          </div>
          {newSteps.length > 0 && (
            <div className="mb-3">
              <p className="text-[11px] font-medium text-[#888] mb-2">Steps ({newSteps.length}):</p>
              <div className="space-y-1">
                {newSteps.map((step, i) => {
                  const tool = toolRegistry.find(t => t.slug === step.toolSlug);
                  return (
                    <div key={step.id} className="flex items-center gap-2 p-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm">
                      <span className="text-[10px] text-[#444] w-5">{i + 1}.</span>
                      <span className="text-[11px] text-[#888] flex-1">{tool?.title || step.toolSlug}</span>
                      <button onClick={() => setNewSteps(prev => prev.filter(s => s.id !== step.id))} className="text-[#888] hover:text-white">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={createWorkflow} disabled={!newName.trim() || newSteps.length === 0} className="flex items-center gap-1 px-3 py-1.5 btn-primary text-[11px] disabled:bg-[#1a1a1a] disabled:text-[#444]">
              <Save size={11} />
              Save
            </button>
            <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 text-[#888] hover:bg-[#1a1a1a] rounded-sm text-[11px]">Cancel</button>
          </div>
        </div>
      )}

      <RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {workflows.map((workflow, index) => (
            <div key={workflow.id} className="card p-4 animate-fade" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-white text-[13px]">{workflow.name}</h3>
                  <p className="text-[11px] text-[#555]">{workflow.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  {workflow.isPreset && <span className="text-[9px] px-1.5 py-0.5 badge-ready rounded-sm font-medium">Preset</span>}
                  <button 
                    onClick={() => setWorkflows(prev => prev.filter(w => w.id !== workflow.id))} 
                    className="p-1 hover:bg-[#1a1a1a] rounded-sm transition-all"
                  >
                    <Trash2 size={11} className="text-[#666]" />
                  </button>
                </div>
              </div>
              
              {/* Workflow Steps */}
              <div className="flex items-center gap-1 flex-wrap mt-3">
                {workflow.steps.map((step, i) => {
                  const tool = toolRegistry.find(t => t.slug === step.toolSlug);
                  return (
                    <div key={step.id} className="flex items-center gap-1">
                      <span className="px-2 py-1 bg-[#111] border border-[#1f1f1f] rounded-sm text-[10px] text-[#888] font-medium">
                        {tool?.title || step.toolSlug}
                      </span>
                      {i < workflow.steps.length - 1 && <ArrowRight size={9} className="text-[#333]" />}
                    </div>
                  );
                })}
              </div>
              
              {/* Run Button */}
              <div className="mt-3 flex items-center gap-2">
                <button 
                  onClick={() => runWorkflow(workflow.id)}
                  disabled={runningWorkflow === workflow.id}
                  className="flex items-center gap-1 px-3 py-1.5 btn-primary text-[11px] disabled:opacity-50"
                >
                  <Play size={10} className={runningWorkflow === workflow.id ? 'animate-spin' : ''} />
                  {runningWorkflow === workflow.id ? 'Running...' : 'Run'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* File Upload Section */}
      {runningWorkflow && (
        <RevealSection className="mt-6">
          <div className="card p-6 animate-fade">
            <h3 className="text-white font-semibold mb-4">Upload Files for Workflow</h3>
            <div className="border-2 border-dashed border-[#333] rounded-lg p-8 text-center hover:border-[#555] transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="workflow-upload"
              />
              <label htmlFor="workflow-upload" className="cursor-pointer">
                <p className="text-[#888] mb-2">Click to upload PDF files</p>
                <p className="text-[#555] text-[11px]">or drag and drop here</p>
              </label>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-white text-sm mb-2">Uploaded Files:</p>
                <div className="space-y-2">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-[#111] rounded">
                      <FileText size={14} className="text-[#888]" />
                      <span className="text-[#ccc] text-sm flex-1">{file.name}</span>
                      <span className="text-[#666] text-xs">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </RevealSection>
      )}    </div>
  );
}
