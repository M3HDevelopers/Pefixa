import { useState, useCallback, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Search, FileText } from 'lucide-react';

export function ViewerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [pages, setPages] = useState<{ index: number; width: number; height: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPDF = useCallback(async (f: File) => {
    setFile(f);
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const count = pdf.getPageCount();
      setPageCount(count);
      setCurrentPage(1);
      const pageInfo = [];
      for (let i = 0; i < count; i++) {
        const page = pdf.getPage(i);
        const { width, height } = page.getSize();
        pageInfo.push({ index: i, width: Math.round(width), height: Math.round(height) });
      }
      setPages(pageInfo);
      setMetadata({ title: pdf.getTitle() || 'N/A', author: pdf.getAuthor() || 'N/A', pages: String(count), fileSize: `${(f.size / 1024).toFixed(1)} KB` });
    } catch (err) { console.error(err); }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type === 'application/pdf') loadPDF(files[0]);
  }, [loadPDF]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 1) setCurrentPage(p => p - 1);
      if (e.key === 'ArrowRight' && currentPage < pageCount) setCurrentPage(p => p + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentPage, pageCount]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {file && (
        <div className="w-44 bg-[#0a0a0a] border-r border-[#1f1f1f] overflow-y-auto p-2">
          <p className="text-[10px] font-semibold text-[#555] mb-2 px-1 uppercase tracking-wider">Pages ({pageCount})</p>
          <div className="space-y-0.5">
            {pages.map((page, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-full text-left p-2 rounded-sm text-[11px] transition-colors ${currentPage === i + 1 ? 'bg-[#1a1a1a] text-white border border-[#333]' : 'text-[#888] hover:bg-[#111]'}`}>
                <div className="flex items-center gap-2"><FileText size={11} /><span>Page {i + 1}</span></div>
                <p className="text-[9px] text-[#444] ml-4">{page.width}×{page.height}pt</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {file && (
          <div className="h-11 bg-[#0a0a0a] border-b border-[#1f1f1f] flex items-center px-4 gap-3">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="p-1 hover:bg-[#1a1a1a] rounded-sm disabled:opacity-30"><ChevronLeft size={14} /></button>
            <span className="text-[12px] text-[#888] min-w-[70px] text-center">{currentPage} / {pageCount}</span>
            <button onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))} disabled={currentPage >= pageCount} className="p-1 hover:bg-[#1a1a1a] rounded-sm disabled:opacity-30"><ChevronRight size={14} /></button>
            <div className="w-px h-5 bg-[#1f1f1f]" />
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 hover:bg-[#1a1a1a] rounded-sm"><ZoomOut size={14} /></button>
            <span className="text-[11px] text-[#888] min-w-[35px] text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(300, z + 10))} className="p-1 hover:bg-[#1a1a1a] rounded-sm"><ZoomIn size={14} /></button>
            <div className="w-px h-5 bg-[#1f1f1f]" />
            <div className="relative flex-1 max-w-xs">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#444]" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-7 pr-3 py-1.5 bg-[#000] border border-[#1f1f1f] rounded-sm text-[11px] text-white placeholder:text-[#333] focus:outline-none focus:border-[#333]" aria-label="Search document" />
            </div>
            <div className="flex-1" />
            <span className="text-[11px] text-[#555] truncate max-w-xs">{file.name}</span>
          </div>
        )}

        <div className="flex-1 overflow-auto bg-[#000] p-6">
          {!file ? (
            <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} className={`border border-dashed rounded-sm p-20 text-center max-w-lg mx-auto mt-16 ${dragOver ? 'border-[#4da6ff] bg-[#0a0a0a]' : 'border-[#2a2a2a]'}`}>
              <FileText size={40} className="mx-auto text-[#333] mb-4" />
              <p className="text-[#888] mb-2">Drop a PDF here to view</p>
              <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 btn-primary text-[12px]">Select PDF</button>
              <input ref={fileInputRef} type="file" accept="application/pdf" onChange={e => e.target.files?.[0] && loadPDF(e.target.files[0])} className="hidden" />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-sm p-8 mb-4" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
                <div className="text-center py-20 border border-dashed border-[#222] rounded-sm">
                  <FileText size={56} className="mx-auto text-[#222] mb-4" />
                  <p className="text-[#888] font-medium">Page {currentPage}</p>
                  <p className="text-[11px] text-[#444] mt-1">{pages[currentPage - 1]?.width} × {pages[currentPage - 1]?.height} points</p>
                </div>
              </div>
              <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-sm p-4">
                <h3 className="text-[11px] font-semibold text-white mb-2 uppercase tracking-wider">Document Info</h3>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {Object.entries(metadata).map(([key, value]) => (<div key={key}><span className="text-[#444] capitalize">{key}: </span><span className="text-[#888]">{value}</span></div>))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
