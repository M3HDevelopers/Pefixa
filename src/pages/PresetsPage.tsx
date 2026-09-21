import { useState } from 'react';
import { toolRegistry } from '../lib/tools/registry';
import { Bookmark, Plus, Trash2, Edit2, Save, Download, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ToolPreset {
  id: string;
  toolSlug: string;
  name: string;
  options: Record<string, any>;
  createdAt: number;
}

const defaultPresets: ToolPreset[] = [
  { id: '1', toolSlug: 'compress-pdf', name: 'High Compression', options: { level: 'high' }, createdAt: Date.now() },
  { id: '2', toolSlug: 'compress-pdf', name: 'Best Quality', options: { level: 'low' }, createdAt: Date.now() },
  { id: '3', toolSlug: 'watermark-text', name: 'Confidential Stamp', options: { text: 'CONFIDENTIAL', opacity: 0.5, rotation: 45 }, createdAt: Date.now() },
  { id: '4', toolSlug: 'encrypt-pdf', name: 'Basic Protection', options: { userPassword: '', ownerPassword: '' }, createdAt: Date.now() },
  { id: '5', toolSlug: 'page-numbers', name: 'Bottom Center', options: { position: 'bottom-center', format: 'number', startFrom: 1 }, createdAt: Date.now() },
  { id: '6', toolSlug: 'bates-numbering', name: 'Legal Standard', options: { prefix: 'BATES-', start: 1, padding: 6, position: 'top-right' }, createdAt: Date.now() },
];

export function PresetsPage() {
  const [presets, setPresets] = useState<ToolPreset[]>(defaultPresets);
  const [showCreate, setShowCreate] = useState(false);
  const [newPreset, setNewPreset] = useState({ toolSlug: 'compress-pdf', name: '', options: {} });

  const deletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  };

  const createPreset = () => {
    if (!newPreset.name.trim()) return;
    const preset: ToolPreset = {
      id: uuidv4(),
      toolSlug: newPreset.toolSlug,
      name: newPreset.name,
      options: newPreset.options,
      createdAt: Date.now(),
    };
    setPresets(prev => [...prev, preset]);
    setShowCreate(false);
    setNewPreset({ toolSlug: 'compress-pdf', name: '', options: {} });
  };

  const exportPresets = () => {
    const data = JSON.stringify(presets, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pefixa-presets.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bookmark size={24} className="text-blue-600" />
            Tool Presets
          </h1>
          <p className="text-sm text-gray-500">Save and reuse common tool configurations</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportPresets}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200"
          >
            <Download size={12} />
            Export
          </button>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
          >
            <Plus size={12} />
            New Preset
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Create Preset</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Preset Name</label>
              <input
                type="text"
                value={newPreset.name}
                onChange={e => setNewPreset(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., High Quality Compress"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Tool</label>
              <select
                value={newPreset.toolSlug}
                onChange={e => setNewPreset(prev => ({ ...prev, toolSlug: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {toolRegistry.filter(t => t.options.length > 0).map(tool => (
                  <option key={tool.slug} value={tool.slug}>{tool.title}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={createPreset}
                disabled={!newPreset.name.trim()}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400"
              >
                <Save size={12} />
                Save Preset
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {presets.map(preset => {
          const tool = toolRegistry.find(t => t.slug === preset.toolSlug);
          return (
            <div key={preset.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{preset.name}</h3>
                  <p className="text-xs text-gray-500">{tool?.title || preset.toolSlug}</p>
                </div>
                <button
                  onClick={() => deletePreset(preset.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Trash2 size={12} className="text-gray-400" />
                </button>
              </div>
              {Object.keys(preset.options).length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(preset.options).slice(0, 4).map(([key, value]) => (
                      <span key={key} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {presets.length === 0 && (
        <div className="text-center py-12">
          <Bookmark size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 text-sm">No presets yet</p>
          <p className="text-gray-400 text-xs mt-1">Save tool configurations to reuse them later</p>
        </div>
      )}
    </div>
  );
}
