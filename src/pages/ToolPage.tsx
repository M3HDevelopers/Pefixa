import { useParams, Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { getToolBySlug } from '../lib/tools/registry';
import { processTool } from '../lib/processors/local';
import { useAppStore } from '../store';
import { ToolOutput } from '../types/tool';
import {
  Upload,
  FileText,
  Play,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Trash2,
  X,
  Info,
  Zap,
  Server,
  Brain,
  Cpu,
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
      if (tool?.acceptedTypes.includes(f.type)) return true;
      if (f.type === 'application/pdf' && tool?.acceptedTypes.includes('application/pdf')) return true;
      return false;
    });
    if (tool?.acceptsMultiple) {
      setFiles(prev => [...prev, ...validFiles]);
    } else {
      setFiles(validFiles.slice(0, 1));
    }
  }, [tool]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (tool?.acceptsMultiple) {
      setFiles(prev => [...prev, ...selectedFiles]);
    } else {
      setFiles(selectedFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (!tool || files.length === 0) return;
    setProcessing(true);
    setError(null);
    setOutput(null);

    const jobId = addJob(tool, files, options);
    updateJob(jobId, { status: 'processing', progress: 30 });
    addRecentTool(tool.slug);

    try {
      updateJob(jobId, { status: 'analyzing', progress: 50 });
      const result = await processTool(tool, { files, options });
      updateJob(jobId, { status: 'ready', progress: 100, outputFiles: result.files.map(f => ({ name: f.name, size: f.blob.size })) });
      setOutput(result);
    } catch (err: any) {
      updateJob(jobId, { status: 'failed', error: { code: 'PROCESSING_ERROR', message: err.message } });
      setError(err.message || 'Processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = (file: { name: string; blob: Blob }) => {
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    if (!output) return;
    output.files.forEach(file => handleDownload(file));
  };

  if (!tool) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Tool not found</p>
          <Link to="/tools" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Browse all tools</Link>
        </div>
      </div>
    );
  }

  const capabilityInfo = {
    'browser-ready': { icon: Cpu, label: 'Browser Ready', color: 'green', desc: 'Fully processed in your browser' },
    'browser-partial': { icon: Zap, label: 'Browser Partial', color: 'yellow', desc: 'Partially processed locally' },
    'backend-required': { icon: Server, label: 'Backend Required', color: 'blue', desc: 'Requires server processing' },
    'ai-required': { icon: Brain, label: 'AI Required', color: 'purple', desc: 'Requires AI backend' },
  };

  const cap = capabilityInfo[tool.capability];
  const CapIcon = cap.icon;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <Link to="/tools" className="hover:text-gray-600">Tools</Link>
          <ArrowRight size={10} />
          <span className="text-gray-600">{tool.title}</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{tool.title}</h1>
            <p className="text-gray-600">{tool.description}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${cap.color}-50 text-${cap.color}-700`}>
            <CapIcon size={12} />
            <span>{cap.label}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">{cap.desc}</p>
      </div>

      {/* File Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all mb-6 ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <Upload size={32} className="mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-600 mb-1">
          Drag & drop {tool.acceptsMultiple ? 'PDF files' : 'a PDF file'} here
        </p>
        <p className="text-xs text-gray-400 mb-3">or</p>
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors">
          <input
            type="file"
            accept={tool.acceptedTypes.join(',')}
            multiple={tool.acceptsMultiple}
            onChange={handleFileSelect}
            className="hidden"
          />
          Select Files
        </label>
        <p className="text-[10px] text-gray-400 mt-2">
          Accepted: {tool.acceptedTypes.join(', ')} • Max: {tool.maxFileSizeMB}MB
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">{files.length} file(s) selected</p>
            <button onClick={() => setFiles([])} className="text-xs text-red-500 hover:text-red-700">Clear all</button>
          </div>
          <div className="space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <FileText size={16} className="text-red-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{file.name}</p>
                  <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => removeFile(i)} className="p-1 hover:bg-gray-100 rounded">
                  <X size={14} className="text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      {tool.options.length > 0 && (
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Options</h3>
          <div className="grid grid-cols-2 gap-4">
            {tool.options.map(opt => (
              <div key={opt.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{opt.label}</label>
                {opt.type === 'select' && (
                  <select
                    value={options[opt.key] ?? opt.default}
                    onChange={e => setOptions(prev => ({ ...prev, [opt.key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  >
                    {opt.options?.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                )}
                {opt.type === 'text' && (
                  <input
                    type="text"
                    value={options[opt.key] ?? opt.default}
                    onChange={e => setOptions(prev => ({ ...prev, [opt.key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                )}
                {opt.type === 'number' && (
                  <input
                    type="number"
                    value={options[opt.key] ?? opt.default}
                    onChange={e => setOptions(prev => ({ ...prev, [opt.key]: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
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
                    className="w-full"
                  />
                )}
                {opt.type === 'boolean' && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options[opt.key] ?? opt.default}
                      onChange={e => setOptions(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600">Enabled</span>
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
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Play size={16} />
            Process {tool.title}
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="text-red-500 mt-0.5" />
          <div>
            <p className="text-sm text-red-700 font-medium">Processing Error</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <h3 className="text-sm font-medium text-gray-900">Processing Complete</h3>
            </div>
            {output.files.length > 1 && (
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
              >
                <Download size={12} />
                Download All
              </button>
            )}
          </div>

          {/* Warnings */}
          {output.warnings.length > 0 && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              {output.warnings.map((w, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-yellow-700">
                  <Info size={12} />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Output Files */}
          <div className="space-y-2">
            {output.files.map((file, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <FileText size={16} className="text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{file.name}</p>
                  <p className="text-[10px] text-gray-400">{(file.blob.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => handleDownload(file)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                >
                  <Download size={12} />
                  Download
                </button>
              </div>
            ))}
          </div>

          {/* Metadata */}
          {output.metadata && Object.keys(output.metadata as Record<string, unknown>).length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Details</p>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(output.metadata).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="text-gray-400">{key}: </span>
                    <span className="text-gray-700">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chain to another tool */}
          {tool.supportsChaining && output.files.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Continue with another tool:</p>
              <div className="flex flex-wrap gap-2">
                {['merge-pdf', 'compress-pdf', 'rotate-pages', 'encrypt-pdf', 'split-pdf'].map(slug => {
                  const t = getToolBySlug(slug);
                  if (!t || t.slug === tool.slug) return null;
                  return (
                    <Link
                      key={slug}
                      to={`/tools/${slug}`}
                      className="px-2 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded text-xs text-gray-600 transition-colors"
                    >
                      {t.title}
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
