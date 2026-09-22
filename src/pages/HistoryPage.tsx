import { useAppStore } from '../store';
import { Link } from 'react-router-dom';
import { Trash2, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

export function HistoryPage() {
  const jobs = useAppStore(s => s.jobs);
  const clearJobs = useAppStore(s => s.clearJobs);
  const removeJob = useAppStore(s => s.removeJob);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle2 size={13} className="text-[#4ade80]" />;
      case 'failed': return <XCircle size={13} className="text-[#f87171]" />;
      case 'processing':
      case 'analyzing': return <Loader2 size={13} className="text-[#4da6ff] animate-spin" />;
      default: return <Clock size={13} className="text-[#555]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Processing History</h1>
          <p className="text-[13px] text-[#888]">{jobs.length} jobs</p>
        </div>
        {jobs.length > 0 && (
          <button onClick={clearJobs} className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-[#f87171] hover:bg-[#1a0a0a] rounded-sm transition-colors">
            <Trash2 size={11} />
            Clear All
          </button>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20">
          <Clock size={36} className="mx-auto text-[#222] mb-3" />
          <p className="text-[#888] text-[13px]">No processing history yet</p>
          <Link to="/tools" className="inline-block mt-4 px-4 py-2 btn-primary text-[12px]">
            Browse Tools
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map(job => (
            <div key={job.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {statusIcon(job.status)}
                  <div>
                    <p className="font-medium text-white text-[13px]">{job.toolTitle}</p>
                    <p className="text-[11px] text-[#555]">
                      {job.inputFiles.length} file(s) • {new Date(job.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-sm font-medium ${
                    job.status === 'ready' ? 'badge-ready' :
                    job.status === 'failed' ? 'bg-[#1a0a0a] text-[#f87171] border border-[#331111]' :
                    'bg-[#0a0a1a] text-[#4da6ff] border border-[#112233]'
                  }`}>
                    {job.status}
                  </span>
                  <button onClick={() => removeJob(job.id)} className="p-1 hover:bg-[#1a1a1a] rounded-sm">
                    <Trash2 size={11} className="text-[#444]" />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {job.inputFiles.map((f, i) => (
                  <span key={i} className="text-[10px] bg-[#111] text-[#666] px-1.5 py-0.5 rounded-sm">{f.name}</span>
                ))}
              </div>

              {job.status === 'processing' && (
                <div className="mt-2 progress-bar h-1">
                  <div className="progress-fill h-full" style={{ width: `${job.progress}%` }} />
                </div>
              )}

              {job.error && (
                <div className="mt-2 flex items-center gap-1 text-[11px] text-[#f87171]">
                  <AlertCircle size={11} />
                  <span>{job.error.message}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
