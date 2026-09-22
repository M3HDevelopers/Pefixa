import { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Search, FileText, Info, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface InspectionResult {
  fileName: string;
  fileSize: string;
  pageCount: number;
  title: string;
  author: string;
  pages: { index: number; width: number; height: number }[];
  health: { score: number; warnings: string[]; errors: string[] };
}

export function InspectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inspect = useCallback(async (f: File) => {
    setFile(f);
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = Array.from({ length: pdf.getPageCount() }, (_, i) => {
        const page = pdf.getPage(i);
        const { width, height } = page.getSize();
        return { index: i + 1, width: Math.round(width), height: Math.round(height) };
      });

      const warnings: string[] = [];
      const errors: string[] = [];
      if (!pdf.getTitle()) warnings.push('Document has no title');
      if (!pdf.getAuthor()) warnings.push('Document has no author');
      const sizes = new Set(pages.map(p => `${p.width}x${p.height}`));
      if (sizes.size > 1) warnings.push(`Mixed page sizes detected (${sizes.size} different sizes)`);
      const score = Math.max(0, 100 - (warnings.length * 10) - (errors.length * 25));

      setResult({ fileName: f.name, fileSize: `${(f.size / 1024).toFixed(1)} KB`, pageCount: pdf.getPageCount(), title: pdf.getTitle() || 'N/A', author: pdf.getAuthor() || 'N/A', pages, health: { score, warnings, errors } });
    } catch (err) { console.error(err); }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type === 'application/pdf') inspect(files[0]);
  }, [inspect]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Search size={22} />PDF Inspector</h1>
        <p className="text-[13px] text-[#888]">Analyze PDF structure, metadata, and health</p>
      </div>

      {!file ? (
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} className={`border border-dashed rounded-sm p-20 text-center ${dragOver ? 'border-[#4da6ff] bg-[#0a0a0a]' : 'border-[#2a2a2a]'}`}>
          <Search size={36} className="mx-auto text-[#333] mb-4" />
          <p className="text-[#888] mb-2">Drop a PDF to inspect</p>
          <button onClick={() => inputRef.current?.click()} className="px-4 py-2 btn-primary text-[12px]">Select PDF</button>
          <input ref={inputRef} type="file" accept="application/pdf" onChange={e => e.target.files?.[0] && inspect(e.target.files[0])} className="hidden" />
        </div>
      ) : result && (
        <div className="space-y-3">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-semibold text-white flex items-center gap-2"><Shield size={13} />Health Report</h2>
              <div className={`text-2xl font-bold ${result.health.score >= 80 ? 'text-[#4ade80]' : result.health.score >= 50 ? 'text-[#fbbf24]' : 'text-[#f87171]'}`}>{result.health.score}/100</div>
            </div>
            <div className="progress-bar h-1.5 mb-3">
              <div className={`h-full ${result.health.score >= 80 ? 'bg-[#4ade80]' : result.health.score >= 50 ? 'bg-[#fbbf24]' : 'bg-[#f87171]'}`} style={{ width: `${result.health.score}%` }} />
            </div>
            {result.health.warnings.map((w, i) => (<div key={i} className="flex items-center gap-2 text-[11px] text-[#fbbf24]"><AlertTriangle size={11} /><span>{w}</span></div>))}
            {result.health.warnings.length === 0 && result.health.errors.length === 0 && (<div className="flex items-center gap-2 text-[11px] text-[#4ade80]"><CheckCircle size={11} /><span>No issues detected</span></div>)}
          </div>

          <div className="card p-4">
            <h2 className="text-[12px] font-semibold text-white flex items-center gap-2 mb-3"><Info size={13} />Metadata</h2>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><span className="text-[#444]">File:</span> <span className="text-[#888]">{result.fileName}</span></div>
              <div><span className="text-[#444]">Size:</span> <span className="text-[#888]">{result.fileSize}</span></div>
              <div><span className="text-[#444]">Pages:</span> <span className="text-[#888]">{result.pageCount}</span></div>
              <div><span className="text-[#444]">Title:</span> <span className="text-[#888]">{result.title}</span></div>
              <div><span className="text-[#444]">Author:</span> <span className="text-[#888]">{result.author}</span></div>
            </div>
          </div>

          <div className="card p-4">
            <h2 className="text-[12px] font-semibold text-white flex items-center gap-2 mb-3"><FileText size={13} />Pages ({result.pages.length})</h2>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-[11px]">
                <thead className="sticky top-0 bg-[#0d0d0d]">
                  <tr className="border-b border-[#1f1f1f]"><th className="text-left py-1 text-[#555] font-medium">Page</th><th className="text-left py-1 text-[#555] font-medium">Width</th><th className="text-left py-1 text-[#555] font-medium">Height</th><th className="text-left py-1 text-[#555] font-medium">Orientation</th></tr>
                </thead>
                <tbody>
                  {result.pages.map(page => (<tr key={page.index} className="border-b border-[#111]"><td className="py-1 text-[#888]">{page.index}</td><td className="py-1 text-[#888]">{page.width}</td><td className="py-1 text-[#888]">{page.height}</td><td className="py-1 text-[#888]">{page.width > page.height ? 'Landscape' : 'Portrait'}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>

          <button onClick={() => { setFile(null); setResult(null); }} className="text-[11px] text-[#4da6ff] hover:text-blue-400">← Inspect another PDF</button>
        </div>
      )}
    </div>
  );
}
