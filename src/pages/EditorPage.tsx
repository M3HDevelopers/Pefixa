import { useState, useCallback } from 'react';
import { Upload, FileText, X, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

export function EditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0 && droppedFiles[0].type === 'application/pdf') {
      setFile(droppedFiles[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">PDF Editor</h1>
        <p className="text-sm text-gray-500">Visual PDF editing with annotations, text, and shapes</p>
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
          <Upload size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 mb-2">Drop a PDF here to start editing</p>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-700">
            <input type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />
            Select PDF
          </label>
        </div>
      ) : (
        <div className="flex gap-4">
          {/* Toolbar */}
          <div className="w-12 bg-white border border-gray-200 rounded-xl p-2 flex flex-col items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg" title="Select">
              <FileText size={16} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg" title="Rotate">
              <RotateCw size={16} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg" title="Zoom In">
              <ZoomIn size={16} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg" title="Zoom Out">
              <ZoomOut size={16} className="text-gray-600" />
            </button>
            <hr className="w-full border-gray-200 my-1" />
            <button className="p-2 hover:bg-gray-100 rounded-lg" title="Remove">
              <X size={16} className="text-red-400" />
            </button>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-gray-100 rounded-xl border border-gray-200 p-8 flex items-center justify-center min-h-[500px]">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-sm font-medium text-gray-700">{file.name}</p>
              <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700">
                  PDF rendering and visual editing will use PDF.js when fully integrated.
                  <br />This is a placeholder for the editor canvas.
                </p>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-56 bg-white border border-gray-200 rounded-xl p-3">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">Properties</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-gray-500 uppercase">File</label>
                <p className="text-xs text-gray-700 truncate">{file.name}</p>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase">Size</label>
                <p className="text-xs text-gray-700">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase">Annotations</label>
                <p className="text-xs text-gray-400">None</p>
              </div>
            </div>

            <hr className="my-3 border-gray-100" />

            <h3 className="text-xs font-semibold text-gray-700 mb-2">Add Element</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded">
                + Text Box
              </button>
              <button className="w-full text-left px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded">
                + Image
              </button>
              <button className="w-full text-left px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded">
                + Rectangle
              </button>
              <button className="w-full text-left px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded">
                + Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
