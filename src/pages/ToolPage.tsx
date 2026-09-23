import { useParams, Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { getToolBySlug, getNextSteps } from '../lib/tools/registry';
import { getToolIcon } from '../lib/tools/icons';
import { processTool } from '../lib/processors/local';
import { useAppStore } from '../store';
import { ToolOutput } from '../types/tool';
import {
  Upload, FileText, Play, Download, AlertCircle, CheckCircle2,
  Loader2, ArrowRight, X, Info, Sparkles,
} from 'lucide-react';

export function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = getToolBySlug(slug || '');
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, any>>({});
  const [processing, setProcessing] = useState(false);
  const [output, setOutput] = useState<ToolOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const addRecentTool = useAppStore(s => s.addRecentTool);
  const addJob = useAppStore(s => s.addJob);
  const updateJob = useAppStore(s => s.updateJob);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(f => {
      if (tool?.inputMode === 'any') return true;
      if (tool?.acceptedTypes.length === 0) return true;
      if (tool?.acceptedTypes.includes(f.type)) return true;
      if (f.type === 'application/pdf' && tool?.acceptedTypes.includes('application/pdf')) return true;
      return false;
    });
    if (tool?.inputMode === 'multiple') {
      setFiles(prev => [...prev, ...validFiles]);
    } else {
      setFiles(validFiles.slice(0, 1));
    }
  }, [tool]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (tool?.inputMode === 'multiple') {
      setFiles(prev => [...prev, ...selectedFiles]);
    } else {
      setFiles(selectedFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleProcess = async () => {
    if (!tool || files.length === 0) return;
    setProcessing(true);
    setError(null);
    setOutput(null);
    
    try {
      const jobId = addJob(tool, files, options);
      updateJob(jobId, { status: 'processing', progress: 30 });
      addRecentTool(tool.slug);
      
      updateJob(jobId, { status: 'analyzing', progress: 50 });
      const result = await processTool(tool, { files, options });
      
      updateJob(jobId, { 
        status: 'ready', 
        progress: 100, 
        outputFiles: result.files.map(f => ({ name: f.name, size: f.blob.size })) 
      });
      setOutput(result);
    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.message || 'Processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (file: { name: string; blob: Blob }) => {
    try {
      const url = URL.createObjectURL(file.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error('Download error:', err);
      setError('Download failed. Please try again.');
    }
  };

  if (!tool) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-md p-8 text-center">
          <p className="text-[#888] text-lg mb-2">Tool not found</p>
          <Link to="/tools" className="btn-primary inline-block px-4 py-2 text-sm">Browse all tools</Link>
        </div>
      </div>
    );
  }

  const ToolIcon = getToolIcon(tool.slug);

  const capabilityInfo = {
    'browser-ready': { label: 'Browser Ready', badgeClass: 'badge-ready', desc: 'Fully processed in your browser' },
    'browser-partial': { label: 'Hybrid', badgeClass: 'badge-partial', desc: 'Partially processed locally' },
    'backend-required': { label: 'Cloud Required', badgeClass: 'badge-backend', desc: 'Requires server processing' },
    'ai-required': { label: 'AI Required', badgeClass: 'badge-ai', desc: 'Requires AI backend' },
  };

  const cap = capabilityInfo[tool.capability];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[11px] text-[#555] mb-4">
          <Link to="/tools" className="hover:text-white transition-colors">Tools</Link>
          <ArrowRight size={10} />
          <span className="text-[#888]">{tool.title}</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="icon-box w-14 h-14 shrink-0">
            <ToolIcon size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">{tool.title}</h1>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium ${cap.badgeClass}`}>
                <span>{cap.label}</span>
              </div>
            </div>
            <p className="text-[#888] text-[13px]">{tool.description}</p>
            <p className="text-[11px] text-[#555] mt-1">{cap.desc}</p>
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`bg-[#0a0a0a] border border-dashed border-[#1a1a1a] rounded-md p-12 text-center transition-all mb-6 ${
          dragOver ? 'border-[#333] bg-[#111]' : ''
        }`}
      >
        <Upload size={32} className="mx-auto text-[#404040] mb-3" />
        <p className="text-[13px] text-[#888] mb-1">
          Drag & drop {tool.inputMode === 'multiple' ? 'files' : 'a file'} here
        </p>
        <p className="text-[11px] text-[#555] mb-4">or</p>
        <label className="inline-flex items-center gap-2 px-4 py-2 btn-primary text-[12px] cursor-pointer">
          <input
            type="file"
            accept={tool.acceptedTypes.length > 0 ? tool.acceptedTypes.join(',') : undefined}
            multiple={tool.inputMode === 'multiple'}
            onChange={handleFileSelect}
            className="hidden"
          />
          Select Files
        </label>
        <p className="text-[10px] text-[#404040] mt-3">
          {tool.acceptedTypes.length > 0 ? tool.acceptedTypes.join(', ') : 'Any file type'} • Max {tool.maxFileSizeMB}MB
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mb-6 animate-fade">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-medium text-[#888]">{files.length} file(s) selected</p>
            <button onClick={() => setFiles([])} className="text-[11px] text-[#888] hover:text-white transition-colors">Clear all</button>
          </div>
          <div className="space-y-1.5">
            {files.map((file, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-md flex items-center gap-3 px-3 py-2.5">
                <FileText size={14} className="text-[#666]" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-[#555]">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => removeFile(i)} className="p-1 hover:bg-[#1a1a1a] rounded transition-colors">
                  <X size={12} className="text-[#666]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      {tool.options.length > 0 && (
        <div className="mb-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md p-5">
          <h3 className="text-[11px] font-semibold text-white mb-4 uppercase tracking-[0.15em]">Options</h3>
          <div className="grid grid-cols-2 gap-4">
            {tool.options.map(opt => (
              <div key={opt.key}>
                <label className="block text-[11px] font-medium text-[#888] mb-1.5">{opt.label}</label>
                {opt.type === 'select' && (
                  <select
                    value={options[opt.key] ?? opt.default}
                    onChange={e => setOptions(prev => ({ ...prev, [opt.key]: e.target.value }))}
                    className="w-full px-3 py-2 input-dark"
                  >
                    {opt.options?.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
                  </select>
                )}
                {opt.type === 'text' && (
                  <input
                    type="text"
                    value={options[opt.key] ?? opt.default}
                    onChange={e => setOptions(prev => ({ ...prev, [opt.key]: e.target.value }))}
                    className="w-full px-3 py-2 input-dark"
                  />
                )}
                {opt.type === 'number' && (
                  <input
                    type="number"
                    value={options[opt.key] ?? opt.default}
                    onChange={e => setOptions(prev => ({ ...prev, [opt.key]: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 input-dark"
                  />
                )}
                {opt.type === 'range' && (
                  <input
                    type="range"
                    min={opt.min}
                    max={opt.max}
                    step={opt.step}
                    value={options[opt.key] ?? opt.default}
                    onChange={e => setOptions(prev => ({ ...prev, [opt.key]: parseFloat(e.target.value) }))}
                    className="w-full accent-white"
                  />
                )}
                {opt.type === 'boolean' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options[opt.key] ?? opt.default}
                      onChange={e => setOptions(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                      className="rounded border-[#333] bg-[#050505] text-white focus:ring-0"
                    />
                    <span className="text-[11px] text-[#888]">Enabled</span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Process Button */}
      <button
        onClick={handleProcess}
        disabled={files.length === 0 || processing}
        className="w-full py-3.5 btn-primary text-[13px] disabled:bg-white/5 disabled:text-[#404040] disabled:cursor-not-allowed disabled:border-white/5 flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Play size={14} />
            Process {tool.title}
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-[#0a0a0a] border border-[#331111] rounded-md p-3 flex items-start gap-2 animate-fade">
          <AlertCircle size={14} className="text-[#f87171] mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] text-white font-medium">Error</p>
            <p className="text-[11px] text-[#888]">{error}</p>
          </div>
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mt-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md p-5 animate-fade">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#4ade80]" />
              <h3 className="text-[12px] font-medium text-white">Processing Complete</h3>
            </div>
            {output.files.length > 1 && (
              <button
                onClick={() => output.files.forEach(handleDownload)}
                className="flex items-center gap-1 px-3 py-1.5 btn-primary text-[11px]"
              >
                <Download size={11} />
                Download All
              </button>
            )}
          </div>

          {output.warnings.length > 0 && (
            <div className="mb-4 bg-[#050505] border border-[#1a1a1a] rounded-md p-3">
              {output.warnings.map((w, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#888]">
                  <Info size={11} />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1.5">
            {output.files.map((file, i) => (
              <div key={i} className="bg-[#050505] border border-[#1a1a1a] rounded-md flex items-center gap-3 p-3">
                <FileText size={14} className="text-[#666]" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-[#555]">{(file.blob.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => handleDownload(file)}
                  className="flex items-center gap-1 px-3 py-1.5 btn-secondary text-[11px]"
                >
                  <Download size={11} />
                  Download
                </button>
              </div>
            ))}
          </div>

          {output.metadata && Object.keys(output.metadata as Record<string, unknown>).length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#555] font-semibold mb-2">Details</p>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(output.metadata).map(([key, value]) => (
                  <div key={key} className="text-[11px]">
                    <span className="text-[#555]">{key}: </span>
                    <span className="text-[#888]">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Next Step Engine */}
          {output.files.length > 0 && (
            <div className="mt-5 pt-5 border-t border-[#1a1a1a]">
              <p className="text-[11px] text-[#888] mb-3 flex items-center gap-1.5">
                <Sparkles size={11} className="text-white" />
                Suggested next steps:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {getNextSteps(tool.slug).map(nextTool => {
                  const NextIcon = getToolIcon(nextTool.slug);
                  return (
                    <Link
                      key={nextTool.slug}
                      to={`/tools/${nextTool.slug}`}
                      className="group flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md px-3 py-2 text-[11px] text-[#888] hover:text-white hover:border-[#333] transition-all"
                    >
                      <NextIcon size={12} />
                      <span>{nextTool.title}</span>
                      <ArrowRight size={10} className="text-[#404040] group-hover:text-white" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
