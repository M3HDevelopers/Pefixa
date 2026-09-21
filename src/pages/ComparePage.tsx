import { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, GitCompare, FileText, ArrowLeftRight } from 'lucide-react';

interface DocInfo {
  file: File;
  pageCount: number;
  title: string;
  author: string;
  fileSize: string;
}

export function ComparePage() {
  const [doc1, setDoc1] = useState<DocInfo | null>(null);
  const [doc2, setDoc2] = useState<DocInfo | null>(null);
  const [mode, setMode] = useState<'visual' | 'text' | 'metadata'>('metadata');
  const [dropTarget, setDropTarget] = useState<1 | 2 | null>(null);
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);

  const loadDoc = useCallback(async (file: File, slot: 1 | 2): Promise<DocInfo> => {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    return {
      file,
      pageCount: pdf.getPageCount(),
      title: pdf.getTitle() || 'Untitled',
      author: pdf.getAuthor() || 'Unknown',
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
    };
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, slot: 1 | 2) => {
    e.preventDefault();
    setDropTarget(null);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type === 'application/pdf') {
      const info = await loadDoc(files[0], slot);
      if (slot === 1) setDoc1(info); else setDoc2(info);
    }
  }, [loadDoc]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const info = await loadDoc(files[0], slot);
      if (slot === 1) setDoc1(info); else setDoc2(info);
    }
  };

  const renderDocSlot = (doc: DocInfo | null, slot: 1 | 2) => (
    <div
      onDragOver={(e) => { e.preventDefault(); setDropTarget(slot); }}
      onDragLeave={() => setDropTarget(null)}
      onDrop={(e) => handleDrop(e, slot)}
      className={`flex-1 border-2 border-dashed rounded-xl p-8 text-center transition-all min-h-[200px] flex flex-col items-center justify-center ${
        dropTarget === slot ? 'border-blue-400 bg-blue-50' : doc ? 'border-green-300 bg-green-50' : 'border-gray-200'
      }`}
    >
      {doc ? (
        <div>
          <FileText size={32} className="mx-auto text-green-500 mb-2" />
          <p className="text-sm font-medium text-gray-900">{doc.file.name}</p>
          <p className="text-xs text-gray-500 mt-1">{doc.pageCount} pages • {doc.fileSize}</p>
          <p className="text-xs text-gray-400 mt-1">Title: {doc.title}</p>
          <p className="text-xs text-gray-400">Author: {doc.author}</p>
          <button
            onClick={() => slot === 1 ? setDoc1(null) : setDoc2(null)}
            className="mt-3 text-xs text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ) : (
        <div>
          <Upload size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-600 mb-2">Document {slot}</p>
          <button
            onClick={() => (slot === 1 ? input1Ref : input2Ref).current?.click()}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
          >
            Select PDF
          </button>
          <input
            ref={slot === 1 ? input1Ref : input2Ref}
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileSelect(e, slot)}
            className="hidden"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <GitCompare size={24} className="text-blue-600" />
          Compare PDFs
        </h1>
        <p className="text-sm text-gray-500">Find differences between two PDF documents</p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-6">
        {(['metadata', 'text', 'visual'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === m ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {m === 'metadata' ? 'Metadata' : m === 'text' ? 'Text Diff' : 'Visual Overlay'}
          </button>
        ))}
      </div>

      {/* Document Slots */}
      <div className="flex gap-4 mb-6">
        {renderDocSlot(doc1, 1)}
        <div className="flex items-center">
          <ArrowLeftRight size={20} className="text-gray-300" />
        </div>
        {renderDocSlot(doc2, 2)}
      </div>

      {/* Comparison Results */}
      {doc1 && doc2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Comparison Results</h3>

          {mode === 'metadata' && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-xs border-b border-gray-100 pb-2 font-semibold text-gray-600">
                <span>Property</span>
                <span>Document 1</span>
                <span>Document 2</span>
              </div>
              {[
                { label: 'File Name', v1: doc1.file.name, v2: doc2.file.name },
                { label: 'Pages', v1: String(doc1.pageCount), v2: String(doc2.pageCount) },
                { label: 'File Size', v1: doc1.fileSize, v2: doc2.fileSize },
                { label: 'Title', v1: doc1.title, v2: doc2.title },
                { label: 'Author', v1: doc1.author, v2: doc2.author },
              ].map(row => {
                const diff = row.v1 !== row.v2;
                return (
                  <div key={row.label} className={`grid grid-cols-3 gap-2 text-xs py-1.5 ${diff ? 'bg-yellow-50' : ''}`}>
                    <span className="text-gray-500">{row.label}</span>
                    <span className={diff ? 'text-yellow-700 font-medium' : 'text-gray-700'}>{row.v1}</span>
                    <span className={diff ? 'text-yellow-700 font-medium' : 'text-gray-700'}>{row.v2}</span>
                  </div>
                );
              })}
              <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                <strong>Summary:</strong> {doc1.pageCount === doc2.pageCount ? 'Same page count' : `Different page count (${doc1.pageCount} vs ${doc2.pageCount})`}
              </div>
            </div>
          )}

          {mode === 'text' && (
            <div className="p-4 bg-gray-50 rounded text-xs text-gray-600">
              <p>Text comparison requires PDF.js text extraction. This is a placeholder for the diff view.</p>
              <p className="mt-2">When connected, this will show word-level differences between the two documents.</p>
            </div>
          )}

          {mode === 'visual' && (
            <div className="p-4 bg-gray-50 rounded text-xs text-gray-600">
              <p>Visual overlay comparison renders both documents and highlights pixel differences.</p>
              <p className="mt-2">This requires canvas-based rendering (PDF.js) for page-by-page visual diff.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
