import { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Search, FileText, Info, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface InspectionResult {
  fileName: string;
  fileSize: string;
  pageCount: number;
  title: string;
  author: string;
  subject: string;
  creator: string;
  producer: string;
  pages: { index: number; width: number; height: number }[];
  health: { score: number; warnings: string[]; errors: string[] };
}

export function InspectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inspect = useCallback(async (f: File) => {
    setFile(f);
    setLoading(true);
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

      // Health checks
      if (!pdf.getTitle()) warnings.push('Document has no title');
      if (!pdf.getAuthor()) warnings.push('Document has no author');
      if (pdf.getPageCount() === 0) errors.push('Document has no pages');

      // Check for mixed page sizes
      const sizes = new Set(pages.map(p => `${p.width}x${p.height}`));
      if (sizes.size > 1) warnings.push(`Mixed page sizes detected (${sizes.size} different sizes)`);

      // Check for very large pages
      const largePages = pages.filter(p => p.width > 2000 || p.height > 2000);
      if (largePages.length > 0) warnings.push(`${largePages.length} unusually large page(s) detected`);

      const score = Math.max(0, 100 - (warnings.length * 10) - (errors.length * 25));

      setResult({
        fileName: f.name,
        fileSize: `${(f.size / 1024).toFixed(1)} KB`,
        pageCount: pdf.getPageCount(),
        title: pdf.getTitle() || 'N/A',
        author: pdf.getAuthor() || 'N/A',
        subject: pdf.getSubject() || 'N/A',
        creator: pdf.getCreator() || 'N/A',
        producer: pdf.getProducer() || 'N/A',
        pages,
        health: { score, warnings, errors },
      });
    } catch (err) {
      console.error('Inspection failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type === 'application/pdf') inspect(files[0]);
  }, [inspect]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Search size={24} className="text-blue-600" />
          PDF Inspector
        </h1>
        <p className="text-sm text-gray-500">Analyze PDF structure, metadata, and health</p>
      </div>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-16 text-center transition-all ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <Search size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 mb-2">Drop a PDF to inspect</p>
          <button
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Select PDF
          </button>
          <input ref={inputRef} type="file" accept="application/pdf" onChange={e => e.target.files?.[0] && inspect(e.target.files[0])} className="hidden" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Health Score */}
          {result && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Shield size={14} className="text-blue-600" />
                  Health Report
                </h2>
                <div className={`text-2xl font-bold ${
                  result.health.score >= 80 ? 'text-green-600' :
                  result.health.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {result.health.score}/100
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all ${
                    result.health.score >= 80 ? 'bg-green-500' :
                    result.health.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.health.score}%` }}
                />
              </div>
              {result.health.errors.length > 0 && (
                <div className="space-y-1">
                  {result.health.errors.map((err, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-red-600">
                      <AlertTriangle size={12} />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}
              {result.health.warnings.length > 0 && (
                <div className="space-y-1 mt-2">
                  {result.health.warnings.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-yellow-600">
                      <AlertTriangle size={12} />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
              {result.health.warnings.length === 0 && result.health.errors.length === 0 && (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle size={12} />
                  <span>No issues detected</span>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          {result && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Info size={14} className="text-purple-600" />
                Metadata
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-gray-400">File:</span> <span className="text-gray-700">{result.fileName}</span></div>
                <div><span className="text-gray-400">Size:</span> <span className="text-gray-700">{result.fileSize}</span></div>
                <div><span className="text-gray-400">Pages:</span> <span className="text-gray-700">{result.pageCount}</span></div>
                <div><span className="text-gray-400">Title:</span> <span className="text-gray-700">{result.title}</span></div>
                <div><span className="text-gray-400">Author:</span> <span className="text-gray-700">{result.author}</span></div>
                <div><span className="text-gray-400">Subject:</span> <span className="text-gray-700">{result.subject}</span></div>
                <div><span className="text-gray-400">Creator:</span> <span className="text-gray-700">{result.creator}</span></div>
                <div><span className="text-gray-400">Producer:</span> <span className="text-gray-700">{result.producer}</span></div>
              </div>
            </div>
          )}

          {/* Pages */}
          {result && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <FileText size={14} className="text-teal-600" />
                Pages ({result.pages.length})
              </h2>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-1 text-gray-500 font-medium">Page</th>
                      <th className="text-left py-1 text-gray-500 font-medium">Width (pt)</th>
                      <th className="text-left py-1 text-gray-500 font-medium">Height (pt)</th>
                      <th className="text-left py-1 text-gray-500 font-medium">Orientation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.pages.map(page => (
                      <tr key={page.index} className="border-b border-gray-50">
                        <td className="py-1 text-gray-700">{page.index}</td>
                        <td className="py-1 text-gray-700">{page.width}</td>
                        <td className="py-1 text-gray-700">{page.height}</td>
                        <td className="py-1 text-gray-700">{page.width > page.height ? 'Landscape' : 'Portrait'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reset */}
          <button
            onClick={() => { setFile(null); setResult(null); }}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            ← Inspect another PDF
          </button>
        </div>
      )}
    </div>
  );
}
