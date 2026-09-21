import { useState, useCallback } from 'react';
import { Upload, FileText, X, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

export function EditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0 && droppedFiles[0].type === 'application/pdf') setFile(droppedFiles[0]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">PDF Editor</h1>
        <p className="text-[13px] text-[#888]">Visual PDF editing with annotations, text, and shapes</p>
      </div>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border border-dashed rounded-sm p-20 text-center transition-all ${dragOver ? 'border-[#4da6ff] bg-[#0a0a0a]' : 'border-[#2a2a2a]'}`}
        >
          <Upload size={36} className="mx-auto text-[#333] mb-4" />
          <p className="text-[#888] mb-2">Drop a PDF here to start editing</p>
          <label className="inline-flex items-center gap-2 px-4 py-2 btn-primary text-[12px] cursor-pointer">
            <input type="file" accept="application/pdf" onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} className="hidden" />
            Select PDF
          </label>
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="w-11 bg-[#0d0d0d] border border-[#1f1f1f] rounded-sm p-1.5 flex flex-col items-center gap-1">
            {[{ icon: FileText, title: 'Select' }, { icon: RotateCw, title: 'Rotate' }, { icon: ZoomIn, title: 'Zoom In' }, { icon: ZoomOut, title: 'Zoom Out' }].map(({ icon: Icon, title }) => (
              <button key={title} className="p-2 hover:bg-[#1a1a1a] rounded-sm transition-colors" title={title}>
                <Icon size={14} className="text-[#888]" />
              </button>
            ))}
            <div className="w-full h-px bg-[#1f1f1f] my-1" />
            <button className="p-2 hover:bg-[#1a0a0a] rounded-sm" title="Remove">
              <X size={14} className="text-[#f87171]" />
            </button>
          </div>

          <div className="flex-1 bg-[#0a0a0a] border border-[#1f1f1f] rounded-sm p-8 flex items-center justify-center min-h-[500px]">
            <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-sm p-8 text-center max-w-sm">
              <FileText size={40} className="mx-auto text-[#333] mb-4" />
              <p className="text-[13px] font-medium text-white">{file.name}</p>
              <p className="text-[11px] text-[#444] mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              <div className="mt-4 p-3 bg-[#1a1500] border border-[#332a00] rounded-sm">
                <p className="text-[11px] text-[#fbbf24]">PDF rendering uses PDF.js when fully integrated. This is a placeholder for the editor canvas.</p>
              </div>
            </div>
          </div>

          <div className="w-52 bg-[#0d0d0d] border border-[#1f1f1f] rounded-sm p-3">
            <h3 className="text-[11px] font-semibold text-white mb-2 uppercase tracking-wider">Properties</h3>
            <div className="space-y-2.5">
              <div><p className="text-[9px] text-[#444] uppercase">File</p><p className="text-[11px] text-[#888] truncate">{file.name}</p></div>
              <div><p className="text-[9px] text-[#444] uppercase">Size</p><p className="text-[11px] text-[#888]">{(file.size / 1024).toFixed(1)} KB</p></div>
            </div>
            <div className="my-3 h-px bg-[#1f1f1f]" />
            <h3 className="text-[11px] font-semibold text-white mb-2 uppercase tracking-wider">Add Element</h3>
            <div className="space-y-0.5">
              {['Text Box', 'Image', 'Rectangle', 'Signature'].map(item => (
                <button key={item} className="w-full text-left px-2 py-1.5 text-[11px] text-[#888] hover:bg-[#1a1a1a] hover:text-white rounded-sm transition-colors">+ {item}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
