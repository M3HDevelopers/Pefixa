import { useAppStore } from '../store';
import { Link } from 'react-router-dom';
import { Trash2, Download, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

export function HistoryPage() {
  const jobs = useAppStore(s => s.jobs);
  const clearJobs = useAppStore(s => s.clearJobs);
  const removeJob = useAppStore(s => s.removeJob);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle2 size={14} className="text-green-500" />;
      case 'failed': return <XCircle size={14} className="text-red-500" />;
      case 'processing':
      case 'analyzing': return <Loader2 size={14} className="text-blue-500 animate-spin" />;
      case 'queued': return <Clock size={14} className="text-gray-400" />;
      default: return <Clock size={14} className="text-gray-400" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-50 text-green-700';
      case 'failed': return 'bg-red-50 text-red-700';
      case 'processing':
      case 'analyzing': return 'bg-blue-50 text-blue-700';
      case 'queued': return 'bg-gray-50 text-gray-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Processing History</h1>
          <p className="text-sm text-gray-500">{jobs.length} jobs in history</p>
        </div>
        {jobs.length > 0 && (
          <button
            onClick={clearJobs}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={12} />
            Clear All
          </button>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16">
          <Clock size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 text-sm">No processing history yet</p>
          <p className="text-gray-400 text-xs mt-1">Process a PDF to see it here</p>
          <Link to="/tools" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Browse Tools
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {statusIcon(job.status)}
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{job.toolTitle}</p>
                    <p className="text-xs text-gray-500">
                      {job.inputFiles.length} file(s) • {new Date(job.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${statusColor(job.status)}`}>
                    {job.status}
                  </span>
                  <button
                    onClick={() => removeJob(job.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Trash2 size={12} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Input Files */}
              <div className="mt-2 flex flex-wrap gap-1">
                {job.inputFiles.map((f, i) => (
                  <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    {f.name}
                  </span>
                ))}
              </div>

              {/* Progress */}
              {job.status === 'processing' && (
                <div className="mt-2">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {job.error && (
                <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle size={12} />
                  <span>{job.error.message}</span>
                </div>
              )}

              {/* Warnings */}
              {job.warnings.length > 0 && (
                <div className="mt-2 text-xs text-yellow-600">
                  {job.warnings.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
