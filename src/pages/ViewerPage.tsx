import { useState, useCallback, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Search, FileText, RotateCw } from 'lucide-react';

interface PageInfo {
  index: number;
  width: number;
  height: number;
}

export function ViewerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [pages, setPages] = useState<PageInfo[]>([]);
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
      const pageInfo: PageInfo[] = [];
      for (let i = 0; i < count; i++) {
        const page = pdf.getPage(i);
        const { width, height } = page.getSize();
        pageInfo.push({ index: i, width: Math.round(width), height: Math.round(height) });
      }
      setPages(pageInfo);
      setMetadata({
        title: pdf.getTitle() || 'N/A',
        author: pdf.getAuthor() || 'N/A',
        subject: pdf.getSubject() || 'N/A',
        creator: pdf.getCreator() || 'N/A',
        producer: pdf.getProducer() || 'N/A',
        pages: String(count),
        fileSize: `${(f.size / 1024).toFixed(1)} KB`,
      });
    } catch (err) {
      console.error('Failed to load PDF:', err);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type === 'application/pdf') {
      loadPDF(files[0]);
    }
  }, [loadPDF]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) loadPDF(files[0]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 1) setCurrentPage(p => p - 1);
      if (e.key === 'ArrowRight' && currentPage < pageCount) setCurrentPage(p => p + 1);
      if (e.key === '+' || e.key === '=') setZoom(z => Math.min(z + 10, 300));
      if (e.key === '-') setZoom(z => Math.max(z - 10, 50));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentPage, pageCount]);

  return (
    <div className="flex h-full">
      {/* Thumbnail Sidebar */}
      {file && (
        <div className="w-48 bg-white border-r border-gray-200 overflow-y-auto p-2">
          <p className="text-xs font-semibold text-gray-500 mb-2 px-1">Pages ({pageCount})</p>
          <div className="space-y-1">
            {pages.map((page, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-full text-left p-2 rounded text-xs transition-colors ${
                  currentPage === i + 1 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText size={12} />
                  <span>Page {i + 1}</span>
                </div>
                <p className="text-[10px] text-gray-400 ml-5">{page.width}×{page.height}pt</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Viewer */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        {file && (
          <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-700 min-w-[80px] text-center">
              {currentPage} / {pageCount}
            </span>
            <button onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))} disabled={currentPage >= pageCount} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1.5 hover:bg-gray-100 rounded">
              <ZoomOut size={16} />
            </button>
            <span className="text-xs text-gray-600 min-w-[40px] text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(300, z + 10))} className="p-1.5 hover:bg-gray-100 rounded">
              <ZoomIn size={16} />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search in document..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 bg-gray-100 rounded text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-300"
                aria-label="Search document"
              />
            </div>
            <div className="flex-1" />
            <span className="text-xs text-gray-500 truncate max-w-xs">{file.name}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-16 text-center max-w-lg mx-auto mt-16 transition-all ${
                dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-2">Drop a PDF here to view</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Select PDF
              </button>
              <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {/* Page Display */}
              <div className="bg-white shadow-lg rounded-lg p-8 mb-4" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded">
                  <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium">Page {currentPage}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {pages[currentPage - 1]?.width} × {pages[currentPage - 1]?.height} points
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Full rendering requires PDF.js integration
                  </p>
                </div>
              </div>

              {/* Page Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Document Info</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(metadata).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-400 capitalize">{key}: </span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
