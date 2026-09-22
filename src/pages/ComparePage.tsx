import { useState, useCallback, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, GitCompare, FileText, ArrowLeftRight } from 'lucide-react';

interface DocInfo { file: File; pageCount: number; title: string; author: string; fileSize: string; }

export function ComparePage() {
  const [doc1, setDoc1] = useState<DocInfo | null>(null);
  const [doc2, setDoc2] = useState<DocInfo | null>(null);
  const [mode, setMode] = useState<'metadata' | 'text' | 'visual'>('metadata');
  const [dropTarget, setDropTarget] = useState<1 | 2 | null>(null);
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);

  const loadDoc = useCallback(async (file: File): Promise<DocInfo> => {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    return { file, pageCount: pdf.getPageCount(), title: pdf.getTitle() || 'Untitled', author: pdf.getAuthor() || 'Unknown', fileSize: `${(file.size / 1024).toFixed(1)} KB` };
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, slot: 1 | 2) => {
    e.preventDefault();
    setDropTarget(null);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type === 'application/pdf') {
      const info = await loadDoc(files[0]);
      if (slot === 1) setDoc1(info); else setDoc2(info);
    }
  }, [loadDoc]);

  const renderDocSlot = (doc: DocInfo | null, slot: 1 | 2) => (
    <div onDragOver={(e) => { e.preventDefault(); setDropTarget(slot); }} onDragLeave={() => setDropTarget(null)} onDrop={(e) => handleDrop(e, slot)} className={`flex-1 border border-dashed rounded-sm p-8 text-center transition-all min-h-[180px] flex flex-col items-center justify-center ${dropTarget === slot ? 'border-[#4da6ff] bg-[#0a0a0a]' : doc ? 'border-[#333] bg-[#0d0d0d]' : 'border-[#2a2a2a]'}`}>
      {doc ? (
        <div>
          <FileText size={28} className="mx-auto text-[#4ade80] mb-2" />
          <p className="text-[12px] font-medium text-white">{doc.file.name}</p>
          <p className="text-[10px] text-[#555] mt-1">{doc.pageCount} pages • {doc.fileSize}</p>
          <button onClick={() => slot === 1 ? setDoc1(null) : setDoc2(null)} className="mt-2 text-[10px] text-[#f87171] hover:text-red-400">Remove</button>
        </div>
      ) : (
        <div>
          <Upload size={28} className="mx-auto text-[#333] mb-2" />
          <p className="text-[12px] text-[#888] mb-2">Document {slot}</p>
          <button onClick={() => (slot === 1 ? input1Ref : input2Ref).current?.click()} className="px-3 py-1.5 btn-primary text-[11px]">Select PDF</button>
          <input ref={slot === 1 ? input1Ref : input2Ref} type="file" accept="application/pdf" onChange={async e => { if (e.target.files?.[0]) { const info = await loadDoc(e.target.files[0]); if (slot === 1) setDoc1(info); else setDoc2(info); } }} className="hidden" />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><GitCompare size={22} />Compare PDFs</h1>
        <p className="text-[13px] text-[#888]">Find differences between two PDF documents</p>
      </div>

      <div className="flex gap-1.5 mb-6">
        {(['metadata', 'text', 'visual'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded-sm text-[11px] font-medium transition-colors ${mode === m ? 'bg-white text-black' : 'bg-[#0d0d0d] text-[#888] border border-[#1f1f1f] hover:border-[#333]'}`}>
            {m === 'metadata' ? 'Metadata' : m === 'text' ? 'Text Diff' : 'Visual Overlay'}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        {renderDocSlot(doc1, 1)}
        <div className="flex items-center"><ArrowLeftRight size={18} className="text-[#333]" /></div>
        {renderDocSlot(doc2, 2)}
      </div>

      {doc1 && doc2 && (
        <div className="card p-4">
          <h3 className="text-[12px] font-semibold text-white mb-3">Comparison Results</h3>
          {mode === 'metadata' && (
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-2 text-[11px] border-b border-[#1f1f1f] pb-2 font-semibold text-[#888]">
                <span>Property</span><span>Document 1</span><span>Document 2</span>
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
                  <div key={row.label} className={`grid grid-cols-3 gap-2 text-[11px] py-1.5 ${diff ? 'bg-[#1a1500]' : ''}`}>
                    <span className="text-[#555]">{row.label}</span>
                    <span className={diff ? 'text-[#fbbf24] font-medium' : 'text-[#888]'}>{row.v1}</span>
                    <span className={diff ? 'text-[#fbbf24] font-medium' : 'text-[#888]'}>{row.v2}</span>
                  </div>
                );
              })}
            </div>
          )}
          {(mode === 'text' || mode === 'visual') && (
            <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm text-[11px] text-[#888]">
              <p>{mode === 'text' ? 'Text comparison requires PDF.js text extraction.' : 'Visual overlay renders both documents and highlights differences.'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
