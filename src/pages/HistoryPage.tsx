import { useAppStore } from '../store';
import { Link } from 'react-router-dom';
import { Trash2, Clock, CheckCircle2, XCircle, Loader2, AlertCircle, Download, Eye } from 'lucide-react';
import { getToolIcon } from '../lib/tools/icons';
import { RevealSection } from '../components/RevealSection';

export function HistoryPage() {
  const jobs = useAppStore(s => s.jobs);
  const clearJobs = useAppStore(s => s.clearJobs);
  const removeJob = useAppStore(s => s.removeJob);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle2 size={14} className="text-[#4ade80]" />;
      case 'failed': return <XCircle size={14} className="text-[#f87171]" />;
      case 'processing':
      case 'analyzing': return <Loader2 size={14} className="text-[#60a5fa] animate-spin" />;
      default: return <Clock size={14} className="text-[#666]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20';
      case 'failed': return 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/20';
      case 'processing':
      case 'analyzing': return 'bg-[#60a5fa]/10 text-[#60a5fa] border-[#60a5fa]/20';
      default: return 'bg-[#666]/10 text-[#666] border-[#666]/20';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <RevealSection>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Processing History</h1>
            <p className="text-[13px] text-[#888]">{jobs.length} jobs in history</p>
          </div>
          {jobs.length > 0 && (
            <button 
              onClick={clearJobs} 
              className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-[#888] hover:text-white hover:bg-[#111] rounded-md transition-all"
            >
              <Trash2 size={11} />
              Clear All
            </button>
          )}
        </div>
      </RevealSection>

      {jobs.length === 0 ? (
        <RevealSection>
          <div className="text-center py-20">
            <Clock size={48} className="mx-auto text-[#333] mb-4" />
            <p className="text-[#888] text-[14px] mb-2">No processing history yet</p>
            <p className="text-[#555] text-[12px] mb-4">Process a PDF to see it here</p>
            <Link to="/tools" className="inline-block px-4 py-2 btn-primary text-[12px]">
              Browse Tools
            </Link>
          </div>
        </RevealSection>
      ) : (
        <RevealSection>
          <div className="space-y-3">
            {jobs.map((job, index) => {
              const ToolIcon = getToolIcon(job.toolSlug);
              return (
                <div 
                  key={job.id} 
                  className="card p-5 animate-fade"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="icon-box w-10 h-10 shrink-0">
                        <ToolIcon size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white text-[14px]">{job.toolTitle}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666]">
                          {job.inputFiles.length} file(s) • {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => removeJob(job.id)} 
                        className="p-1.5 hover:bg-[#1a1a1a] rounded-md transition-all"
                        title="Delete"
                      >
                        <Trash2 size={13} className="text-[#666]" />
                      </button>
                    </div>
                  </div>

                  {/* Input Files */}
                  <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
                    <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Input Files</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.inputFiles.map((f, i) => (
                        <span key={i} className="text-[10px] bg-[#111] text-[#888] px-2 py-1 rounded-md border border-[#1a1a1a]">
                          {f.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {job.status === 'processing' && (
                    <div className="mt-3">
                      <div className="progress-bar h-1.5">
                        <div className="progress-fill h-full" style={{ width: `${job.progress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {job.error && (
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-[#f87171]">
                      <AlertCircle size={12} />
                      <span>{job.error.message}</span>
                    </div>
                  )}

                  {/* Output Files */}
                  {job.status === 'ready' && job.outputFiles.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
                      <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Output Files</p>
                      <div className="space-y-1.5">
                        {job.outputFiles.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md">
                            <Download size={12} className="text-[#888]" />
                            <span className="text-[11px] text-[#ccc] flex-1">{f.name}</span>
                            <button className="text-[10px] text-[#60a5fa] hover:text-[#93c5fd] transition-colors">
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </RevealSection>
      )}
    </div>
  );
}
